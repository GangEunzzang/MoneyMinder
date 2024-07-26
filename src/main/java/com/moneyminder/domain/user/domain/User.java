package com.moneyminder.domain.user.domain;

import com.moneyminder.domain.user.domain.type.SocialType;
import com.moneyminder.domain.user.domain.type.UserRole;
import com.moneyminder.domain.user.infrastructure.jpa.entity.UserEntity;
import io.jsonwebtoken.lang.Assert;
import lombok.Builder;

public record User(
        Long id,
        String email,
        String name,
        UserRole userRole,
        SocialType socialType
) {

    @Builder
    public User {
        Assert.hasText(email, "email must not be empty");
        Assert.hasText(name, "name must not be empty");
        Assert.notNull(socialType, "socialType must not be null");
        userRole = userRole == null ? UserRole.USER : userRole;
    }

    public static User create(String email, String name, SocialType socialType) {
        return User.builder()
                .email(email)
                .name(name)
                .userRole(UserRole.USER)
                .socialType(socialType)
                .build();
    }

    public UserEntity toEntity() {
        return UserEntity.builder()
                .id(id)
                .email(email)
                .name(name)
                .userRole(userRole)
                .socialType(socialType)
                .build();
    }


}
