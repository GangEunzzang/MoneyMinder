package com.moneyminder.user.feign;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "user-service",
        path = "/api/v1/user/",
        configuration = UserFeignConfig.class
)
@CircuitBreaker(name = "userservice-circuit-breaker", fallbackMethod = "getUserInfoFallback")
public interface UserFeignClient {

    @GetMapping("/user-info")
    UserApiResponse<UserFeignResponse> getUserInfo(@RequestParam String email);

    default UserApiResponse<UserFeignResponse> getUserInfoFallback(String email, Throwable t) {
        return new UserApiResponse<>(
                200,
                "Fallback triggered",
                UserFeignResponse.builder()
                        .email(email)
                        .name("Fallback User")
                        .build()
        );
    }

}
