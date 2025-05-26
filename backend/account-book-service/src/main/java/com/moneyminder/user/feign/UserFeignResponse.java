package com.moneyminder.user.feign;

import lombok.Builder;

@Builder
public record UserFeignResponse(
        String name,
        String email
) {
}
