package com.moneyminder.domain.notification.infrastructure.jpa.repository;

import com.moneyminder.domain.notification.domain.DeviceToken;
import com.moneyminder.domain.notification.domain.repository.DeviceTokenRepository;
import com.moneyminder.domain.notification.infrastructure.jpa.entity.DeviceTokenEntity;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class DeviceTokenRepositoryImpl implements DeviceTokenRepository {

    private final DeviceTokenJpaRepository jpaRepository;

    @Override
    public DeviceToken save(DeviceToken deviceToken) {
        return jpaRepository.save(DeviceTokenEntity.from(deviceToken)).toDomain();
    }

    @Override
    public void delete(DeviceToken deviceToken) {
        jpaRepository.delete(DeviceTokenEntity.from(deviceToken));
    }

    @Override
    public void deleteAllInBatch() {
        jpaRepository.deleteAllInBatch();
    }

    @Override
    public Optional<DeviceToken> findByToken(String token) {
        return jpaRepository.findByToken(token).map(DeviceTokenEntity::toDomain);
    }

    @Override
    public List<DeviceToken> findByUserEmail(String email) {
        return jpaRepository.findByUserEmail(email).stream()
                .map(DeviceTokenEntity::toDomain)
                .toList();
    }
}
