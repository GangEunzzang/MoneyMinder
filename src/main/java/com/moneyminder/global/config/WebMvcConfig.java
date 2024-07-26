package com.moneyminder.global.config;

import com.moneyminder.domain.auth.application.JwtProvider;
import com.moneyminder.global.resolver.CurrentUserEmailResolver;
import com.moneyminder.global.resolver.CurrentUserResolver;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor
@Configuration
public class WebMvcConfig  implements WebMvcConfigurer {

    private final JwtProvider jwtProvider;

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new CurrentUserEmailResolver(jwtProvider));
        resolvers.add(new CurrentUserResolver(jwtProvider));
    }


}