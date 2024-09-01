package com.moneyminder.global.config;

import com.moneyminder.domain.auth.application.JwtProvider;
import com.moneyminder.domain.auth.infrastructure.filter.CustomOAuth2RedirectFilter;
import com.moneyminder.domain.auth.infrastructure.filter.JwtAuthenticationFilter;
import com.moneyminder.domain.auth.infrastructure.oauth2.handler.OAuth2FailureHandler;
import com.moneyminder.domain.auth.infrastructure.oauth2.handler.Oauth2SuccessHandler;
import com.moneyminder.domain.auth.infrastructure.oauth2.service.PrincipalOAuth2UserService;
import com.moneyminder.global.filter.GlobalExceptionFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity(debug = true)
public class SecurityConfig {

    private final PrincipalOAuth2UserService oAuth2UserService;
    private final Oauth2SuccessHandler oauth2SuccessHandler;
    private final OAuth2FailureHandler oauth2FailureHandler;
    private final JwtProvider jwtProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers(
                                        "/login/**",
                                        "/health/**"
                                )
                                .permitAll()
                                .anyRequest().authenticated())
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserService))
                        .successHandler(oauth2SuccessHandler)
                        .failureHandler(oauth2FailureHandler)
                        .authorizationEndpoint(authorization -> authorization.baseUri("/oauth2/authorization"))
                        .redirectionEndpoint(redirection -> redirection.baseUri("/login/oauth2/code/{registrationId}"))
                )

                .addFilterBefore(new CustomOAuth2RedirectFilter(), OAuth2AuthorizationRequestRedirectFilter.class)
                .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new GlobalExceptionFilter(), JwtAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web.ignoring().requestMatchers(
                "/h2-console/**",
                "/v3/api-docs/**",
                "/swagger-ui*/**",
                "/favicon.ico",
                "/css/**",
                "/js/**",
                "/img/**",
                "/lib/**",
                "/actuator/**",
                "/error"
        );
    }

}