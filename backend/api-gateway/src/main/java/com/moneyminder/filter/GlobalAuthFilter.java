package com.moneyminder.filter;

import com.moneyminder.dto.JwtClaims;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;

@Slf4j
@Component
public class GlobalAuthFilter extends AbstractGatewayFilterFactory<GlobalAuthFilter.Config> {

    private final PathMatcher pathMatcher = new AntPathMatcher();
    private static final List<String> EXCLUDED_PATHS = List.of(
            "/api/auth/**",
            "/login/**",
            "/oauth2/**",
            "/swagger-ui/**",
            "/health/**",
            "/actuator/**",
            "/**"
    );

    @Value("${auth.token.secretKey}")
    private String secretKey;

    private Key key;

    @PostConstruct
    protected void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public GlobalAuthFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getPath().value();

            log.info("[[GlobalAuthFilter]] start");
            log.info("[[GlobalAuthFilter]] path: {}", path);

            if (isExcludedPath(path)) {
                log.info("[[GlobalAuthFilter]] path is excluded: {}", path);
                String rawPath = exchange.getRequest().getURI().getRawPath();
                log.info("[[GlobalAuthFilter]] rawPath: {}", rawPath);
                return chain.filter(exchange);
            }

            String token = exchange.getRequest().getHeaders().getFirst("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String jwt = token.substring(7);

            JwtClaims claims;
            try {
                claims = parseClaims(jwt);
            } catch (Exception e) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            exchange.getRequest().mutate()
                    .header("X-USER-EMAIL", claims.email())
                    .header("X-USER-NAME", claims.name())
                    .header("X-USER-ROLE", claims.role())
                    .build();

            log.info("[[GlobalAuthFilter]] claims: {}", claims);
            log.info("[[GlobalAuthFilter]] end");

            return chain.filter(exchange);
        };
    }

    private boolean isExcludedPath(String path) {
        return EXCLUDED_PATHS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
    }

    private JwtClaims parseClaims(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        String email = claims.getSubject();
        String role = (String) claims.get("authority");
        String name = (String) claims.get("name");

        return JwtClaims.create(email, role, name);
    }

    public static class Config {
    }
}
