package com.moneyminder.auth.infrastructure.oauth2.handler;


import com.moneyminder.auth.JwtProvider;
import com.moneyminder.auth.domain.TokenInfo;
import com.moneyminder.auth.infrastructure.filter.CustomOAuth2RedirectFilter;
import com.moneyminder.auth.infrastructure.oauth2.service.OAuth2UserInfoService;
import com.moneyminder.auth.properties.OAuth2Properties;
import com.moneyminder.user.domain.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;


@Component
@RequiredArgsConstructor
public class Oauth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final OAuth2Properties oAuth2Properties;
    private final OAuth2UserInfoService oAuth2UserInfoService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        super.clearAuthenticationAttributes(request);
        super.getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    @Override
    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) {
        String frontendRedirectUri = (String) request.getSession()
                .getAttribute(CustomOAuth2RedirectFilter.FRONTEND_REDIRECT_URI);

        if (frontendRedirectUri == null || !isAuthorizedRedirectUri(frontendRedirectUri)) {
            throw new IllegalArgumentException("Unauthorized Redirect URI");
        }

        User user = oAuth2UserInfoService.extractUser(authentication);
        TokenInfo tokenInfo = jwtProvider.getAuthentication(user);

        return UriComponentsBuilder
                .fromUriString(frontendRedirectUri)
                .queryParam("accessToken", tokenInfo.accessToken())
                .queryParam("refreshToken", tokenInfo.refreshToken())
                .build().toUriString();
    }

    private boolean isAuthorizedRedirectUri(String uri) {
        URI redirectUrlOfClientRequest = URI.create(uri);

        return oAuth2Properties.getAuthorizedRedirectUris()
                .stream()
                .anyMatch(authorizedRedirectUri -> {
                    URI authorizedURI = URI.create(authorizedRedirectUri);
                    return authorizedURI.getHost().equalsIgnoreCase(redirectUrlOfClientRequest.getHost())
                            && authorizedURI.getPort() == redirectUrlOfClientRequest.getPort();
                });
    }
}
