package com.moneyminder.domain.auth.presentation;

import com.moneyminder.domain.auth.application.AuthService;
import com.moneyminder.domain.auth.domain.TokenInfo;
import com.moneyminder.global.response.DataResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@RestController
public class AuthController {

    private final AuthService authService;

    @PostMapping("/reissue")
    public DataResponse<TokenInfo> reissueToken(String refreshToken) {
        return DataResponse.of(authService.reissueToken(refreshToken));
    }
}
