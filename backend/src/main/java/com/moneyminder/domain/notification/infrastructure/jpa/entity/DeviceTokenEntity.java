package com.moneyminder.domain.notification.infrastructure.jpa.entity;

import com.moneyminder.domain.notification.domain.DeviceToken;
import com.moneyminder.domain.notification.domain.type.DevicePlatform;
import com.moneyminder.global.base.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "device_token", indexes = {
        @Index(name = "idx_device_token_user_email", columnList = "user_email")
})
public class DeviceTokenEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Comment("기기 토큰 고유 식별자")
    private Long id;

    @Column(nullable = false)
    @Comment("유저 이메일")
    private String userEmail;

    @Column(nullable = false, unique = true, length = 255)
    @Comment("푸시 토큰. 같은 기기는 한 행이어야 두 번 보내지 않는다")
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Comment("플랫폼 (IOS, ANDROID)")
    private DevicePlatform platform;

    @Builder
    private DeviceTokenEntity(Long id, String userEmail, String token, DevicePlatform platform) {
        this.id = id;
        this.userEmail = userEmail;
        this.token = token;
        this.platform = platform;
    }

    public static DeviceTokenEntity from(DeviceToken deviceToken) {
        return DeviceTokenEntity.builder()
                .id(deviceToken.getId())
                .userEmail(deviceToken.getUserEmail())
                .token(deviceToken.getToken())
                .platform(deviceToken.getPlatform())
                .build();
    }

    public DeviceToken toDomain() {
        return DeviceToken.builder()
                .id(id)
                .userEmail(userEmail)
                .token(token)
                .platform(platform)
                .build();
    }
}
