package com.moneyminder.domain.user.presentation.dto;

import com.moneyminder.domain.user.application.dto.request.UserLoginReq;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

        @NotBlank
        @Email
        String email,

        @NotBlank
        String password
) {

    public UserLoginReq toService() {
        return UserLoginReq.builder()
                .email(email)
                .password(password)
                .build();
    }
}
