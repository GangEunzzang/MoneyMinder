package com.moneyminder.domain.auth.infrastructure.oauth2.service;

import com.moneyminder.domain.auth.infrastructure.oauth2.info.OAuth2UserInfo;
import com.moneyminder.domain.user.domain.type.SocialType;
import com.moneyminder.domain.user.domain.type.UserRole;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Map;

@Service
public class OAuth2UserInfoService {

    public OAuth2UserInfo extractUserInfo(Authentication authentication) {
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        SocialType socialType = SocialType.fromName(authToken.getAuthorizedClientRegistrationId());
        Map<String, Object> attributes = authToken.getPrincipal().getAttributes();

        return OAuth2UserInfo.of(socialType, attributes);
    }

    public UserRole extractUserRole(Authentication authentication) {
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        Collection<GrantedAuthority> authorities = authToken.getAuthorities();

        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .map(UserRole::fromKey)
                .findFirst()
                .orElse(UserRole.USER);
    }
}
