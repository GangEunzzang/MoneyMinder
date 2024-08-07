package com.moneyminder.domain.auth.infrastructure.jpa.repository;

import com.moneyminder.domain.auth.infrastructure.jpa.entity.RefreshTokenEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenJpaRepository extends JpaRepository<RefreshTokenEntity, Long> {

    Optional<RefreshTokenEntity> findByEmail(String email);

    Optional<RefreshTokenEntity> findByTokenValue(String tokenValue);
}