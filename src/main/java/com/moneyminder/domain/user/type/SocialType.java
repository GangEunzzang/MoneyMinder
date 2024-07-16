package com.moneyminder.domain.user.type;

import com.moneyminder.global.exception.BaseException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SocialType {

    GOOGLE("구글"),
    KAKAO("카카오"),
    NAVER("네이버");

    public static SocialType fromName(String key) {
        for (SocialType socialType : SocialType.values()) {
            if (socialType.name().equalsIgnoreCase(key)) {
                return socialType;
            }
        }
        throw new BaseException("Invalid Social Type");
    }

    private final String description;
}
