package com.moneyminder.domain.notification.application;

import com.moneyminder.domain.notification.domain.DeviceToken;
import com.moneyminder.domain.notification.domain.repository.DeviceTokenRepository;
import com.moneyminder.domain.notification.domain.type.DevicePlatform;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
public class DeviceTokenService {

    private final DeviceTokenRepository deviceTokenRepository;

    /**
     * 같은 토큰이 다시 오면 새로 만들지 않는다. 행이 둘이면 같은 기기에 두 번 보낸다.
     * 계정이 바뀌었다면 그 토큰은 이제 새 계정의 것이다 — 기기를 넘겨준 경우다.
     */
    @Transactional
    public void register(String email, String token, DevicePlatform platform) {
        deviceTokenRepository.findByToken(token)
                .ifPresentOrElse(
                        existing -> {
                            if (existing.isOwnedBy(email)) {
                                existing.refresh(platform);
                            } else {
                                existing.transferTo(email, platform);
                            }

                            deviceTokenRepository.save(existing);
                        },
                        () -> deviceTokenRepository.save(DeviceToken.register(email, token, platform)));
    }

    @Transactional
    public void unregister(String email, String token) {
        deviceTokenRepository.findByToken(token)
                .filter(deviceToken -> deviceToken.isOwnedBy(email))
                .ifPresent(deviceTokenRepository::delete);
    }
}
