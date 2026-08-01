package com.moneyminder.domain.user.application.dto.request;

import com.moneyminder.domain.user.domain.User;
import lombok.Builder;

@Builder
public record UserServiceSignupReq(
        String email,
        String password,
        String name
) {

    public User toDomain() {
        return User.normalCreate(email, name, password);
    }
}
