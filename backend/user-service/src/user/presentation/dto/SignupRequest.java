package com.moneyminder.domain.user.presentation.dto;

import com.moneyminder.domain.user.application.dto.request.UserSignupReq;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SignupRequest(

        @NotBlank
        @Email
        String email,

        @NotBlank
        String name,

        @NotBlank
        String password
) {

    public UserSignupReq toService() {
        return UserSignupReq.builder()
                .email(email)
                .name(name)
                .password(password)
                .build();
    }
}
