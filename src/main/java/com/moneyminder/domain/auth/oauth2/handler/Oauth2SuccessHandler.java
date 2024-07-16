package com.moneyminder.domain.auth.oauth2.handler;


import com.moneyminder.domain.auth.filter.CustomOAuth2RedirectFilter;
import com.moneyminder.domain.auth.jwt.JwtProvider;
import com.moneyminder.domain.auth.jwt.dto.TokenDto;
import com.moneyminder.domain.auth.oauth2.info.OAuth2UserInfo;
import com.moneyminder.domain.auth.oauth2.service.OAuth2UserInfoService;
import com.moneyminder.domain.auth.properties.OAuth2Properites;
import com.moneyminder.domain.user.type.UserRole;
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
    private final OAuth2Properites oAuth2Properites;
    private final OAuth2UserInfoService oAuth2UserInfoService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        super.clearAuthenticationAttributes(request);
        super.getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    @Override
    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String frontendRedirectUri = (String) request.getSession().getAttribute(CustomOAuth2RedirectFilter.FRONTEND_REDIRECT_URI);

        if (frontendRedirectUri == null || !isAuthorizedRedirectUri(frontendRedirectUri)) {
            throw new IllegalArgumentException("Unauthorized Redirect URI");
        }

        OAuth2UserInfo userInfo = oAuth2UserInfoService.extractUserInfo(authentication);
        UserRole userRole = oAuth2UserInfoService.extractUserRole(authentication);

        TokenDto tokenDto = jwtProvider.generateToken(
                userInfo.email(),
                userRole
        );

        return UriComponentsBuilder
                .fromUriString(frontendRedirectUri)
                .queryParam("accessToken", tokenDto.accessToken())
                .queryParam("refreshToken", tokenDto.refreshToken())
                .build().toUriString();
    }

    private boolean isAuthorizedRedirectUri(String uri) {
        URI redirectUrlOfClientRequest = URI.create(uri);

        return oAuth2Properites.getAuthorizedRedirectUris()
                .stream()
                .anyMatch(authorizedRedirectUri -> {
                    URI authorizedURI = URI.create(authorizedRedirectUri);
                    return authorizedURI.getHost().equalsIgnoreCase(redirectUrlOfClientRequest.getHost())
                            && authorizedURI.getPort() == redirectUrlOfClientRequest.getPort();
                });
    }
}