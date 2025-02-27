package com.moneyminder.user.application.dto.request;

import lombok.Builder;

@Builder
public record UserLoginReq(
        String email,
        String password
) {
}
