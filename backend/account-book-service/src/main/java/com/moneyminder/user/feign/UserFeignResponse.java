package com.moneyminder.user.feign;

public record UserFeignResponse(
        String name,
        String email
) {

}
