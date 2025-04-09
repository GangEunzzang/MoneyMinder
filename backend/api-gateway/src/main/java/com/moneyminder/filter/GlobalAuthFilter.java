package com.moneyminder.filter;

import com.moneyminder.auth.JwtProvider;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;

import java.util.List;

@Component
public class GlobalAuthFilter extends AbstractGatewayFilterFactory<GlobalAuthFilter.Config> {

    private final JwtProvider jwtProvider;

    public GlobalAuthFilter(JwtProvider jwtProvider) {
        super(Config.class);
        this.jwtProvider = jwtProvider;
    }


    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            if (isExcludedPath(exchange.getRequest().getPath().value())) {
                return chain.filter(exchange);
            }

            String token = exchange.getRequest().getHeaders().getFirst("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String jwt = token.substring(7);
            if (jwtProvider.validateToken(jwt)) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            org.springframework.security.core.Authentication authentication = jwtProvider.getAuthentication(jwt);

            exchange.getRequest().mutate()
                    .header("X-USER-EMAIL", authentication.getName())
                    .header("X-USER-ROLE", authentication.getAuthorities().toString())
                    .build();

            return chain.filter(exchange);
        };
    }

    public static class Config {
    }

    private static final List<String> EXCLUDED_PATHS = List.of(
            "/api/auth/**",
            "/login/**",
            "/oauth2/**",
            "/swagger-ui/**",
            "/health/**",
            "/actuator/**"
    );

    private boolean isExcludedPath(String path) {
        return EXCLUDED_PATHS.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, path));
    }

    private final PathMatcher pathMatcher = new AntPathMatcher();



}
