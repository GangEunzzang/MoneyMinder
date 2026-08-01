package com.moneyminder.domain.user.presentation.dto;

import com.moneyminder.domain.user.application.dto.request.UserServiceLoginReq;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserLoginReq(

        @NotBlank
        @Email
        String email,

        @NotBlank
        String password
) {

    public UserServiceLoginReq toService() {
        return UserServiceLoginReq.builder()
                .email(email)
                .password(password)
                .build();
    }
}
