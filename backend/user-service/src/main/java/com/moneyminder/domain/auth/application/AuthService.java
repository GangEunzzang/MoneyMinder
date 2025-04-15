package com.moneyminder.domain.auth.application;

import com.moneyminder.domain.auth.domain.RefreshToken;
import com.moneyminder.domain.auth.domain.TokenInfo;
import com.moneyminder.domain.auth.domain.repository.RefreshTokenRepository;
import com.moneyminder.domain.user.domain.User;
import com.moneyminder.domain.user.domain.repository.UserRepository;
import com.moneyminder.dto.JwtClaims;
import com.moneyminder.exception.BaseException;
import com.moneyminder.exception.ResultCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final JwtProviderService jwtProviderService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;


    public TokenInfo generateToken(JwtClaims claims) {
        String newAccessToken = jwtProviderService.generateAccessToken(claims);
        String newRefreshToken = jwtProviderService.generateRefreshToken();

        RefreshToken refreshToken = RefreshToken.create(claims.email(), newRefreshToken);

        refreshTokenRepository.save(refreshToken);

        return TokenInfo.create(newAccessToken, newRefreshToken);
    }


    public TokenInfo reissueToken(String refreshToken) {
        jwtProviderService.validateToken(refreshToken);

        RefreshToken currentRefreshToken = refreshTokenRepository.findByTokenValue(refreshToken)
                .orElseThrow(() -> new BaseException(ResultCode.JWT_INVALID));

        User user = userRepository.findByEmail(currentRefreshToken.email())
                .orElseThrow(() -> new BaseException(ResultCode.USER_NOT_FOUND));

        JwtClaims claims = JwtClaims.create(user.email(), user.userRole().getKey(), user.name());

        String newAccessToken = jwtProviderService.generateAccessToken(claims);
        String newRefreshToken = jwtProviderService.generateRefreshToken();

        refreshTokenRepository.delete(currentRefreshToken);
        refreshTokenRepository.save(RefreshToken.create(user.email(), newRefreshToken));

        return TokenInfo.create(newAccessToken, newRefreshToken);
    }


}
