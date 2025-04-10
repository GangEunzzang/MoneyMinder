package com.moneyminder.auth.application;

import com.moneyminder.auth.JwtProvider;
import com.moneyminder.auth.domain.RefreshToken;
import com.moneyminder.auth.domain.TokenInfo;
import com.moneyminder.auth.domain.repository.RefreshTokenRepository;
import com.moneyminder.dto.JwtClaims;
import com.moneyminder.exception.BaseException;
import com.moneyminder.exception.ResultCode;
import com.moneyminder.user.domain.User;
import com.moneyminder.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final JwtProvider jwtProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;


    public TokenInfo generateToken(JwtClaims claims) {
        String newAccessToken = jwtProvider.generateAccessToken(claims);
        String newRefreshToken = jwtProvider.generateRefreshToken();

        RefreshToken refreshToken = RefreshToken.create(claims.email(), newRefreshToken);

        refreshTokenRepository.save(refreshToken);

        return TokenInfo.create(newAccessToken, newRefreshToken);
    }


    public TokenInfo reissueToken(String refreshToken) {
        jwtProvider.validateToken(refreshToken);

        RefreshToken currentRefreshToken = refreshTokenRepository.findByTokenValue(refreshToken)
                .orElseThrow(() -> new BaseException(ResultCode.JWT_INVALID));

        User user = userRepository.findByEmail(currentRefreshToken.email())
                .orElseThrow(() -> new BaseException(ResultCode.USER_NOT_FOUND));

        JwtClaims claims = JwtClaims.create(user.email(), user.userRole().getKey(), user.name());

        String newAccessToken = jwtProvider.generateAccessToken(claims);
        String newRefreshToken = jwtProvider.generateRefreshToken();

        refreshTokenRepository.delete(currentRefreshToken);
        refreshTokenRepository.save(RefreshToken.create(user.email(), newRefreshToken));

        return TokenInfo.create(newAccessToken, newRefreshToken);
    }


}
