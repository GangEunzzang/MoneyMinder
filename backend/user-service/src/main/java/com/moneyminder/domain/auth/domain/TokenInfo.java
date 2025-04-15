package com.moneyminder.domain.auth.domain;

import lombok.Builder;
import org.springframework.util.Assert;


public record TokenInfo(
        String accessToken,
        String refreshToken
) {

    @Builder
    public TokenInfo {
        Assert.hasText(accessToken, "accessToken must not be empty");
        Assert.hasText(refreshToken, "refreshToken must not be empty");
    }

    public static TokenInfo create(String accessToken, String refreshToken) {
        return TokenInfo.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
