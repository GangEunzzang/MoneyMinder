package com.moneyminder.domain.user.application.dto.request;

import lombok.Builder;

@Builder
public record UserServiceLoginReq(
        String email,
        String password
) {
}
