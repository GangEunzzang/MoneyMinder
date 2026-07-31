package com.moneyminder.domain.auth.infrastructure.filter;

import com.moneyminder.domain.auth.application.JwtProvider;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    /**
     * 필터는 DispatcherServlet 앞이라 여기서 던진 예외는 @RestControllerAdvice 를 거치지 않고
     * 컨테이너로 올라가 500 이 된다. 리졸버를 직접 불러 응답 규격을 맞춘다.
     */
    private final HandlerExceptionResolver handlerExceptionResolver;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String accessToken = jwtProvider.extractAccessToken(request)
                    .orElseThrow(() -> new BaseException(ResultCode.JWT_NOT_FOUND));

            jwtProvider.validateToken(accessToken);
            setAuthentication(accessToken);
        } catch (BaseException e) {
            SecurityContextHolder.clearContext();
            handlerExceptionResolver.resolveException(request, response, null, e);

            return;
        }

        filterChain.doFilter(request, response);
    }

    private void setAuthentication(String accessToken) {
        Authentication authentication = jwtProvider.getAuthentication(accessToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    /**
     * SecurityConfig 의 permitAll 목록과 여기가 어긋나면 인증이 뚫린다. 같이 고친다.
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        return path.startsWith("/health") ||
                path.startsWith("/actuator/health") ||
                path.equals("/api/v1/auth/reissue") ||
                path.equals("/api/v1/users/signup") ||
                path.equals("/api/v1/users/login");
    }
}
