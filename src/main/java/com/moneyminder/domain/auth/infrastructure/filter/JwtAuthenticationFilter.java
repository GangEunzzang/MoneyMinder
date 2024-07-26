package com.moneyminder.domain.auth.infrastructure.filter;

import com.moneyminder.domain.auth.application.JwtProvider;
import com.moneyminder.domain.auth.domain.TokenInfo;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

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
            handleJwtException(e, request, response);
        } catch (Exception e) {
            logger.error("Could not set user authentication in security context", e);
        }

        filterChain.doFilter(request, response);
    }

    private void handleJwtException(BaseException e, HttpServletRequest request, HttpServletResponse response) {
        if (e.getResultCode().equals(ResultCode.JWT_EXPIRED)) {
            String refreshToken = jwtProvider.extractRefreshToken(request)
                    .orElseThrow(() -> new BaseException(ResultCode.JWT_NOT_FOUND, "Refresh Token Not Found"));

            TokenInfo newTokenInfo = jwtProvider.reissueToken(refreshToken);

            response.setHeader(JwtProvider.AUTHORIZATION_HEADER,
                    JwtProvider.BEARER_PREFIX + newTokenInfo.accessToken());
            response.setHeader(JwtProvider.REFRESH_TOKEN_HEADER,
                    JwtProvider.BEARER_PREFIX + newTokenInfo.refreshToken());
        }
    }
}
