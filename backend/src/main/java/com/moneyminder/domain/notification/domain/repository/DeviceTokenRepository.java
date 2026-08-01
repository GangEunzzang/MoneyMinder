package com.moneyminder.domain.notification.domain.repository;

import com.moneyminder.domain.notification.domain.DeviceToken;
import java.util.List;
import java.util.Optional;

public interface DeviceTokenRepository {

    DeviceToken save(DeviceToken deviceToken);

    void delete(DeviceToken deviceToken);

    void deleteAllInBatch();

    Optional<DeviceToken> findByToken(String token);

    List<DeviceToken> findByUserEmail(String email);
}
