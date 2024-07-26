package com.moneyminder.domain.auth.infrastructure.oauth2.info;

import com.moneyminder.domain.user.domain.type.SocialType;
import lombok.Builder;

import java.util.Map;

@Builder
public record OAuth2UserInfo(
        String email,
        String name
) {

    public static OAuth2UserInfo of(SocialType socialType, Map<String, Object> attributes) {
        return switch (socialType) {
            case GOOGLE -> ofGoogle(attributes);
            case KAKAO -> ofKaKao(attributes);
            default -> throw new IllegalArgumentException("Invalid Provider Type");
        };
    }

    private static OAuth2UserInfo ofGoogle(Map<String, Object> attributes) {
        return OAuth2UserInfo.builder()
                .email((String) attributes.get("email"))
                .name((String) attributes.get("name"))
                .build();
    }

    private static OAuth2UserInfo ofKaKao(Map<String, Object> attributes) {
        return null;
    }

}
