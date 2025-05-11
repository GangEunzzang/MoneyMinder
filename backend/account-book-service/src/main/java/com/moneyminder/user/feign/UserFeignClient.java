package com.moneyminder.user.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "user-service",
        path = "/api/v1/user/",
        configuration = UserFeignConfig.class
)
public interface UserFeignClient {

    @GetMapping("/user-info")
    UserApiResponse<UserFeignResponse> getUserInfo(@RequestParam String email);


}
