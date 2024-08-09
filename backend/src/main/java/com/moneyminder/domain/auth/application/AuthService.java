package com.moneyminder.domain.auth.application;

import com.moneyminder.domain.auth.domain.TokenInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final JwtProvider jwtProvider;

    public TokenInfo reissueToken(String refreshToken) {
        jwtProvider.validateToken(refreshToken);

        return jwtProvider.reissueToken(refreshToken);
    }
}
