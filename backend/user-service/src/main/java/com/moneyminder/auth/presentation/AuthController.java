package com.moneyminder.auth.presentation;

import com.moneyminder.auth.application.AuthService;
import com.moneyminder.auth.domain.TokenInfo;
import com.moneyminder.response.DataResponse;
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

