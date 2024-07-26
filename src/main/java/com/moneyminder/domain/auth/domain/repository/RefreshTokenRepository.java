package com.moneyminder.domain.auth.domain.repository;

import com.moneyminder.domain.auth.domain.RefreshToken;
import java.util.Optional;

public interface RefreshTokenRepository {

    Optional<RefreshToken> findByEmail(String email);

    Optional<RefreshToken> findByTokenValue(String tokenValue);

    RefreshToken save(RefreshToken refreshToken);

    void delete(RefreshToken refreshToken);
}