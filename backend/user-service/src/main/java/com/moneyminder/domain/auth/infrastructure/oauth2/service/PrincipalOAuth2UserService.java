package com.moneyminder.domain.auth.infrastructure.oauth2.service;

import com.moneyminder.domain.auth.event.domain.UserRegisterEvent;
import com.moneyminder.domain.auth.infrastructure.oauth2.domain.PrincipalDetails;
import com.moneyminder.domain.auth.infrastructure.oauth2.info.OAuth2UserInfo;
import com.moneyminder.domain.user.domain.User;
import com.moneyminder.domain.user.domain.repository.UserRepository;
import com.moneyminder.domain.user.domain.type.SocialType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class PrincipalOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

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
        log.info("OAuth2User attributes: {}", oAuth2User.getAttributes());

        SocialType socialType = SocialType.fromName(registrationId);
        Map<String, Object> attributes = new HashMap<>();

        switch (socialType) {
            case GOOGLE -> attributes = oAuth2User.getAttributes();
            case NAVER -> attributes = (Map<String, Object>) oAuth2User.getAttributes().get("response");
        }

        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfo.of(socialType, attributes);

        User user = userRepository.findByEmail(oAuth2UserInfo.email())
                .orElseGet(() -> createUser(oAuth2UserInfo));

        return new PrincipalDetails(user, attributes);
    }

    private User createUser(OAuth2UserInfo oAuth2UserInfo) {
        User newUser = User.socialCreate(
                oAuth2UserInfo.email(),
                oAuth2UserInfo.name(),
                oAuth2UserInfo.socialType()
        );

        User user = userRepository.save(newUser);
        eventPublisher.publishEvent(new UserRegisterEvent(user.email(), user.name()));
        return user;
    }
}
