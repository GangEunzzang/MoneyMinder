package com.moneyminder.domain.auth.presentation;

import com.moneyminder.domain.auth.application.AuthService;
import com.moneyminder.domain.auth.domain.TokenInfo;
import com.moneyminder.global.response.DataResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/api/auth/")
@RestController
public class AuthController {

    private final AuthService authService;

    @PostMapping("/reissue")
    public DataResponse<TokenInfo> reissueToken(String refreshToken) {
        TokenInfo tokenInfo = authService.reissueToken(refreshToken);
        return DataResponse.of(tokenInfo);
    }
}

