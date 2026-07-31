package com.moneyminder.domain.auth.domain;

import lombok.Builder;
import lombok.Getter;
import org.springframework.util.Assert;

@Getter
public class RefreshToken {

    private final String email;
    private String tokenValue;

    @Builder
    private RefreshToken(String email, String tokenValue) {
        Assert.hasText(email, "email must not be empty");
        Assert.hasText(tokenValue, "tokenValue must not be empty");

        this.email = email;
        this.tokenValue = tokenValue;
    }

    public static RefreshToken create(String email, String tokenValue) {
        return RefreshToken.builder()
                .email(email)
                .tokenValue(tokenValue)
                .build();
    }

    public void rotate(String tokenValue) {
        Assert.hasText(tokenValue, "tokenValue must not be empty");

        this.tokenValue = tokenValue;
    }

    public boolean matches(String tokenValue) {
        return this.tokenValue.equals(tokenValue);
    }

    public boolean belongsTo(String email) {
        return this.email.equals(email);
    }
}
