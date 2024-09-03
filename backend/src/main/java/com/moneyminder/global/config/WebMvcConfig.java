package com.moneyminder.global.config;

import com.moneyminder.domain.auth.application.JwtProvider;
import com.moneyminder.domain.auth.properties.CorsProperties;
import com.moneyminder.global.resolver.CurrentUserEmailResolver;
import com.moneyminder.global.resolver.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@RequiredArgsConstructor
@Configuration
public class WebMvcConfig  implements WebMvcConfigurer {

    private final JwtProvider jwtProvider;
    private final CorsProperties corsProperties;

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new CurrentUserEmailResolver());
        resolvers.add(new CurrentUserResolver(jwtProvider));
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(corsProperties.getAllowedOrigins().toArray(new String[0]))
                .allowedMethods(corsProperties.getAllowedMethods().toArray(new String[0]))
                .allowedHeaders(corsProperties.getAllowedHeaders().toArray(new String[0]))
                .maxAge(corsProperties.getMaxAge());
    }

}