package com.moneyminder.user.presentation.dto;


import com.moneyminder.user.application.dto.request.UserSignupReq;

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
