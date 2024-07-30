package com.moneyminder.domain.auth.infrastructure.jpa.repository;

import com.moneyminder.domain.auth.domain.RefreshToken;
import com.moneyminder.domain.auth.domain.repository.RefreshTokenRepository;
import com.moneyminder.domain.auth.infrastructure.jpa.entity.RefreshTokenEntity;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class RefreshTokenRepositoryImpl implements RefreshTokenRepository {

    private final RefreshTokenJpaRepository jpaRepository;

    @Override
    public Optional<RefreshToken> findByEmail(String email) {
        return jpaRepository.findByEmail(email)
                .map(RefreshTokenEntity::toDomain);
    }

    @Override
    public Optional<RefreshToken> findByTokenValue(String tokenValue) {
        return jpaRepository.findByTokenValue(tokenValue)
                .map(RefreshTokenEntity::toDomain);
    }

    @Override
    public RefreshToken save(RefreshToken refreshToken) {
        return jpaRepository.save(refreshToken.toEntity()).toDomain();
    }

    @Override
    public void delete(RefreshToken refreshToken) {
        jpaRepository.delete(refreshToken.toEntity());
    }

    @Override
    public void deleteAllInBatch() {
        jpaRepository.deleteAllInBatch();
    }
}