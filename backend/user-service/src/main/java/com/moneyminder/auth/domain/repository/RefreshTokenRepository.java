package com.moneyminder.auth.domain.repository;

import com.moneyminder.auth.domain.RefreshToken;

import java.util.Optional;

public interface RefreshTokenRepository {

    Optional<RefreshToken> findByTokenValue(String tokenValue);

    RefreshToken save(RefreshToken refreshToken);

    void delete(RefreshToken refreshToken);

    void deleteAllInBatch();
}
