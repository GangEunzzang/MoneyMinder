package com.moneyminder.auth.application;

import com.moneyminder.auth.domain.TokenInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final JwtProviderImpl jwtProviderImpl;

    public TokenInfo reissueToken(String refreshToken) {
        jwtProviderImpl.validateToken(refreshToken);

        return jwtProviderImpl.reissueToken(refreshToken);
    }
}
