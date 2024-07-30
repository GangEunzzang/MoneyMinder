package com.moneyminder.domain.auth.infrastructure.filter;

import com.moneyminder.domain.auth.application.JwtProvider;
import com.moneyminder.domain.auth.domain.TokenInfo;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String accessToken = jwtProvider.extractAccessToken(request)
                    .orElseThrow(() -> new BaseException(ResultCode.JWT_NOT_FOUND));

            jwtProvider.validateToken(accessToken);
            Authentication authentication = jwtProvider.getAuthentication(accessToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (BaseException e) {
            switch (e.getResultCode()) {
                case JWT_EXPIRED -> reissueToken(request, response);
                default -> {
                    log.error("JWT validation failed: {}", e.getMessage());
                    throw new BaseException(e.getResultCode(), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Could not set user authentication in security context", e);
        }

        filterChain.doFilter(request, response);
    }

    private void reissueToken(HttpServletRequest request, HttpServletResponse response) {
        try {
            String refreshToken = jwtProvider.extractRefreshToken(request)
                    .orElseThrow(() -> new BaseException(ResultCode.JWT_NOT_FOUND, "Refresh Token Not Found"));

            TokenInfo newTokenInfo = jwtProvider.reissueAccessToken(refreshToken);

            response.setHeader(JwtProvider.AUTHORIZATION_HEADER,
                    JwtProvider.BEARER_PREFIX + newTokenInfo.accessToken());
            response.setHeader(JwtProvider.REFRESH_TOKEN_HEADER,
                    JwtProvider.BEARER_PREFIX + newTokenInfo.refreshToken());

        } catch (BaseException e) {
            log.error("Failed to reissue token: {}", e.getMessage());
            throw new BaseException(e.getResultCode(), e.getMessage());
        }
    }
}
