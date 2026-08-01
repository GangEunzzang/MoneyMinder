package com.moneyminder.domain.notification.infrastructure.jpa.repository;

import com.moneyminder.domain.notification.infrastructure.jpa.entity.DeviceTokenEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceTokenJpaRepository extends JpaRepository<DeviceTokenEntity, Long> {

    Optional<DeviceTokenEntity> findByToken(String token);

    List<DeviceTokenEntity> findByUserEmail(String userEmail);
}
