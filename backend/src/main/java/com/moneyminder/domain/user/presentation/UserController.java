package com.moneyminder.domain.user.presentation;

import com.moneyminder.domain.auth.domain.TokenInfo;
import com.moneyminder.domain.user.application.UserService;
import com.moneyminder.domain.user.presentation.dto.UserLoginReq;
import com.moneyminder.domain.user.presentation.dto.UserSignupReq;
import com.moneyminder.global.response.APIResponse;
import com.moneyminder.global.response.DataResponse;
import jakarta.validation.Valid;
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
    public APIResponse signup(@Valid @RequestBody UserSignupReq signupReq) {
        userService.signup(signupReq.toService());
        return DataResponse.empty();
    }

    @PostMapping("/login")
    public APIResponse login(@Valid @RequestBody UserLoginReq loginReq) {
        TokenInfo login = userService.login(loginReq.toService());
        return DataResponse.of(login);
    }
}
