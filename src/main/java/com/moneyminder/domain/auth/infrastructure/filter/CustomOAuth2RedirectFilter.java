package com.moneyminder.domain.auth.infrastructure.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class CustomOAuth2RedirectFilter extends OncePerRequestFilter {

    public static final String FRONTEND_REDIRECT_URI = "frontend_redirect_uri";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String frontendRedirectUri = request.getParameter(FRONTEND_REDIRECT_URI);

        if (frontendRedirectUri != null) {
            HttpSession session = request.getSession();
            session.setAttribute(FRONTEND_REDIRECT_URI, frontendRedirectUri);
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return !request.getRequestURI()
                .startsWith("/oauth2/authorization/");
    }
}
