package com.moneyminder.domain.user.presentation;

import com.moneyminder.domain.auth.domain.TokenInfo;
import com.moneyminder.domain.user.application.UserService;
import com.moneyminder.domain.user.presentation.dto.LoginRequest;
import com.moneyminder.domain.user.presentation.dto.SignupRequest;
import com.moneyminder.global.response.APIResponse;
import com.moneyminder.global.response.DataResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/api/v1/user/")
@RestController
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public APIResponse signup(@RequestBody SignupRequest signupRequest) {
        userService.signup(signupRequest.toService());
        return DataResponse.empty();
    }

    @PostMapping("/login")
    public APIResponse login(@RequestBody LoginRequest loginRequest) {
        TokenInfo login = userService.login(loginRequest.toService());
        return DataResponse.of(login);
    }
}