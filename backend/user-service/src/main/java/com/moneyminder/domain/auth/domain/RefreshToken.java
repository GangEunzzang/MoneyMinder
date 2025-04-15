package com.moneyminder.domain.auth.domain;

import com.moneyminder.domain.auth.infrastructure.redis.entity.RefreshTokenRedis;
import lombok.Builder;
import org.springframework.util.Assert;

public record RefreshToken(
        String email,
        String tokenValue
) {


    @Builder
    public RefreshToken {
        Assert.hasText(email, "email must not be empty");
        Assert.hasText(tokenValue, "tokenValue must not be empty");
    }

    public static RefreshToken create(String email, String tokenValue) {
        return RefreshToken.builder()
                .email(email)
                .tokenValue(tokenValue)
                .build();
    }

    public RefreshToken update(RefreshToken update) {
        return RefreshToken.builder()
                .email(email)
                .tokenValue(update.tokenValue())
                .build();
    }

    public RefreshToken update(String tokenValue) {
        return RefreshToken.builder()
                .email(email)
                .tokenValue(tokenValue)
                .build();
    }

    public RefreshTokenRedis toEntity() {
        return RefreshTokenRedis.builder()
                .email(email)
                .tokenValue(tokenValue)
                .build();
    }
}

