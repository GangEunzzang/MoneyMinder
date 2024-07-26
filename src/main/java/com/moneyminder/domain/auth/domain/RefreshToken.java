package com.moneyminder.domain.auth.domain;

import com.moneyminder.domain.auth.infrastructure.jpa.entity.RefreshTokenEntity;
import lombok.Builder;
import org.springframework.util.Assert;

public record RefreshToken(

        Long id,
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
                .id(id)
                .email(email)
                .tokenValue(update.tokenValue())
                .build();
    }

    public RefreshToken update(String tokenValue) {
        return RefreshToken.builder()
                .id(id)
                .email(email)
                .tokenValue(tokenValue)
                .build();
    }

    public RefreshTokenEntity toEntity() {
        return RefreshTokenEntity.builder()
                .id(id)
                .email(email)
                .tokenValue(tokenValue)
                .build();
    }
}

