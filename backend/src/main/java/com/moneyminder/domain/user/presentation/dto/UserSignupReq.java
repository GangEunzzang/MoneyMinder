package com.moneyminder.domain.user.presentation.dto;

import com.moneyminder.domain.user.application.dto.request.UserServiceSignupReq;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserSignupReq(

        @NotBlank
        @Email
        String email,

        @NotBlank
        String name,

        @NotBlank
        String password
) {

    public UserServiceSignupReq toService() {
        return UserServiceSignupReq.builder()
                .email(email)
                .name(name)
                .password(password)
                .build();
    }
}
