package com.moneyminder.domain.notification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moneyminder.domain.notification.application.DeviceTokenService;
import com.moneyminder.domain.notification.domain.DeviceToken;
import com.moneyminder.domain.notification.domain.repository.DeviceTokenRepository;
import com.moneyminder.domain.notification.domain.type.DevicePlatform;
import com.moneyminder.global.exception.BaseException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DeviceTokenServiceTest {

    private static final String EMAIL = "device-test@moneyminder.com";
    private static final String TOKEN = "ExponentPushToken[aaaaaaaaaaaaaaaaaaaaaa]";

    @Autowired
    private DeviceTokenService deviceTokenService;

    @Autowired
    private DeviceTokenRepository deviceTokenRepository;

    @BeforeEach
    void setUp() {
        deviceTokenRepository.deleteAllInBatch();
    }

    @Nested
    class 등록 {

        @DisplayName("토큰을 등록하면 조회할 수 있다.")
        @Test
        void whenRegister_thenFindable() {
            deviceTokenService.register(EMAIL, TOKEN, DevicePlatform.IOS);

            DeviceToken saved = deviceTokenRepository.findByToken(TOKEN).orElseThrow();

            assertThat(saved.getUserEmail()).isEqualTo(EMAIL);
            assertThat(saved.getPlatform()).isEqualTo(DevicePlatform.IOS);
        }

        /** 행이 둘이면 같은 기기에 푸시를 두 번 보낸다. */
        @DisplayName("같은 토큰을 다시 등록해도 행이 늘지 않는다.")
        @Test
        void whenRegisterTwice_thenSingleRow() {
            deviceTokenService.register(EMAIL, TOKEN, DevicePlatform.IOS);
            deviceTokenService.register(EMAIL, TOKEN, DevicePlatform.IOS);

            assertThat(deviceTokenRepository.findByUserEmail(EMAIL)).hasSize(1);
        }

        @DisplayName("기기를 넘겨받으면 그 토큰은 새 주인의 것이 된다.")
        @Test
        void whenOtherUserRegistersSameToken_thenOwnerChanges() {
            deviceTokenService.register(EMAIL, TOKEN, DevicePlatform.IOS);
            deviceTokenService.register("new-owner@moneyminder.com", TOKEN, DevicePlatform.IOS);

            assertThat(deviceTokenRepository.findByUserEmail(EMAIL)).isEmpty();
            assertThat(deviceTokenRepository.findByToken(TOKEN).orElseThrow().getUserEmail())
                    .isEqualTo("new-owner@moneyminder.com");
        }
    }

    @Nested
    class 해제 {

        @DisplayName("등록을 해제하면 사라진다.")
        @Test
        void whenUnregister_thenGone() {
            deviceTokenService.register(EMAIL, TOKEN, DevicePlatform.IOS);
            deviceTokenService.unregister(EMAIL, TOKEN);

            assertThat(deviceTokenRepository.findByToken(TOKEN)).isEmpty();
        }

        @DisplayName("남의 토큰은 해제하지 못한다.")
        @Test
        void whenOtherUser_thenKept() {
            deviceTokenService.register(EMAIL, TOKEN, DevicePlatform.IOS);
            deviceTokenService.unregister("stranger@moneyminder.com", TOKEN);

            assertThat(deviceTokenRepository.findByToken(TOKEN)).isPresent();
        }
    }

    @Nested
    class 소유권 {

        @DisplayName("남의 기기 토큰은 건드릴 수 없다.")
        @Test
        void whenNotOwner_thenThrow() {
            DeviceToken token = DeviceToken.register(EMAIL, TOKEN, DevicePlatform.IOS);

            assertThatThrownBy(() -> token.validateOwner("stranger@moneyminder.com"))
                    .isInstanceOf(BaseException.class);
        }
    }
}
