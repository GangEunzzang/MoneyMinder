package com.moneyminder.domain.notification.domain;

import com.moneyminder.domain.notification.domain.type.DevicePlatform;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import lombok.Builder;
import lombok.Getter;
import org.springframework.util.Assert;

/**
 * 서버가 푸시를 보내려면 기기를 알아야 한다. 지금은 알림을 앱이 직접 쏘므로
 * 여기 쌓이기만 하고 쓰이지 않는다 ([[DECISIONS#BD12]]) — 발송기를 붙일 때 앱은 고치지 않는다.
 */
@Getter
public class DeviceToken {

    private final Long id;
    private final String token;
    private String userEmail;
    private DevicePlatform platform;

    @Builder
    private DeviceToken(Long id, String userEmail, String token, DevicePlatform platform) {
        Assert.hasText(userEmail, "userEmail must not be empty");
        Assert.hasText(token, "token must not be empty");
        Assert.notNull(platform, "platform must not be null");

        this.id = id;
        this.userEmail = userEmail;
        this.token = token;
        this.platform = platform;
    }

    public static DeviceToken register(String userEmail, String token, DevicePlatform platform) {
        return DeviceToken.builder()
                .userEmail(userEmail)
                .token(token)
                .platform(platform)
                .build();
    }

    /**
     * 같은 기기가 앱을 지웠다 깔면 토큰은 같다. 행을 새로 만들면 같은 기기에 두 번 보내게 된다.
     */
    public void refresh(DevicePlatform platform) {
        this.platform = platform;
    }

    /**
     * 한 기기를 다른 사람이 쓰기 시작한 경우. 행을 지우고 새로 만들면
     * JPA 가 insert 를 delete 보다 먼저 흘려보내 unique 제약에 걸린다.
     */
    public void transferTo(String userEmail, DevicePlatform platform) {
        Assert.hasText(userEmail, "userEmail must not be empty");

        this.userEmail = userEmail;
        this.platform = platform;
    }

    public boolean isOwnedBy(String email) {
        return userEmail.equals(email);
    }

    public void validateOwner(String email) {
        if (!isOwnedBy(email)) {
            throw new BaseException(ResultCode.DEVICE_TOKEN_FORBIDDEN);
        }
    }
}
