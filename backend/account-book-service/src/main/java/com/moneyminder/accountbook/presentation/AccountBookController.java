import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;

import java.util.stream.Collectors;```java
`

@Component
public class JwtGatewayFilter implements GatewayFilter {

    @Autowired
    JwtTokenProvider jwtProvider;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = resolveToken(exchange.getRequest());
        if (token != null && jwtProvider.validateToken(token)) {
            Authentication auth = jwtProvider.getAuthentication(token);
            ServerHttpRequest mutatedRequest = exchange.getRequest().mutate().header("X-USER-ID", auth.getName()).header("X-USER-ROLE", String.join(",", auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))).build();
            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        }
        return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT Token"));
    }
}`

        ```
