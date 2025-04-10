package com.moneyminder.dto;

import com.mysema.commons.lang.Assert;
import lombok.Builder;

public record JwtClaims(
        String email,
        String name,
        String role
) {

    @Builder
    public JwtClaims {
        Assert.hasText(email, "email must not be empty");
        Assert.hasText(name, "name must not be empty");
        Assert.hasText(role, "role must not be empty");
    }

    public static JwtClaims create(String email, String role, String name) {
        return JwtClaims.builder()
                .email(email)
                .role(role)
                .name(name)
                .build();
    }
}
