package com.moneyminder.domain.auth.infrastructure.redis.repository;

import com.moneyminder.domain.auth.domain.RefreshToken;
import com.moneyminder.domain.auth.domain.repository.RefreshTokenRepository;
import com.moneyminder.domain.auth.infrastructure.redis.entity.RefreshTokenRedis;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class RefreshTokenRepositoryImpl implements RefreshTokenRepository {

    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    @Override
    public Optional<RefreshToken> findByTokenValue(String tokenValue) {
        return refreshTokenRedisRepository.findById(tokenValue).map(RefreshTokenRedis::toDomain);
    }

    @Override
    public RefreshToken save(RefreshToken refreshToken) {
        RefreshTokenRedis refreshTokenRedis = RefreshTokenRedis.from(refreshToken);
        refreshTokenRedisRepository.save(refreshTokenRedis);
        return refreshToken;
    }

    @Override
    public void delete(RefreshToken refreshToken) {
        refreshTokenRedisRepository.deleteById(refreshToken.getTokenValue());
    }

    @Override
    public void deleteAllInBatch() {
        refreshTokenRedisRepository.deleteAll();
    }
}
