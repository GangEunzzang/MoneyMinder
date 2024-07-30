package com.moneyminder.domain.auth.infrastructure.oauth2.service;

import com.moneyminder.domain.auth.infrastructure.oauth2.info.OAuth2UserInfo;
import com.moneyminder.domain.user.domain.User;
import com.moneyminder.domain.user.domain.repository.UserRepository;
import com.moneyminder.domain.user.domain.type.SocialType;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
public class PrincipalOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = oAuth2UserService.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName();

        log.info("registrationId : {}", registrationId);
        log.info("userNameAttributeName : {}", userNameAttributeName);

        SocialType socialType = SocialType.fromName(registrationId);
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfo.of(socialType, oAuth2User.getAttributes());

        User user = userRepository.findByEmail(oAuth2UserInfo.email())
                .orElseGet(() -> createUser(oAuth2UserInfo));

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(user.userRole().getKey())),
                oAuth2User.getAttributes(),
                userNameAttributeName
        );
    }

    private User createUser(OAuth2UserInfo oAuth2UserInfo) {
        User newUser = User.create(
                oAuth2UserInfo.email(),
                oAuth2UserInfo.name(),
                SocialType.GOOGLE
        );

        return userRepository.save(newUser);
    }
}
