package com.moneyminder.domain.auth.infrastructure.oauth2.info;

import com.moneyminder.domain.user.domain.type.SocialType;
import java.util.Map;
import lombok.Builder;

@Builder
public record OAuth2UserInfo(
        String email,
        String name,
        SocialType socialType
) {

    public static OAuth2UserInfo of(SocialType socialType, Map<String, Object> attributes) {
        return switch (socialType) {
            case GOOGLE -> ofGoogle(attributes);
            case KAKAO -> ofKaKao(attributes);
            case NAVER -> ofNaver(attributes);
            default -> throw new IllegalArgumentException("Invalid Provider Type");
        };
    }

    private static OAuth2UserInfo ofNaver(Map<String, Object> attributes) {
        return OAuth2UserInfo.builder()
                .email((String) attributes.get("email"))
                .name((String) attributes.get("name"))
                .socialType(SocialType.NAVER)
                .build();
    }

    private static OAuth2UserInfo ofGoogle(Map<String, Object> attributes) {
        return OAuth2UserInfo.builder()
                .email((String) attributes.get("email"))
                .name((String) attributes.get("name"))
                .socialType(SocialType.GOOGLE)
                .build();
    }

    private static OAuth2UserInfo ofKaKao(Map<String, Object> attributes) {
        return null;
    }

}
