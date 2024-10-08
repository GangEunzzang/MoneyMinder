package com.moneyminder.domain.auth.infrastructure.oauth2.handler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

@Component
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException {

//        String frontRedirectUrl = request.getParameter("frontend_redirect_uri");
//
//        frontRedirectUrl = UriComponentsBuilder.fromUriString(frontRedirectUrl)
//                .queryParam("error", exception.getLocalizedMessage())
//                .build().toUriString();
//
//        getRedirectStrategy().sendRedirect(request, response, frontRedirectUrl);
    }
}