package com.moneyminder.domain.auth.infrastructure.redis.entity;

import com.moneyminder.domain.auth.domain.RefreshToken;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@RedisHash(value = "RefreshToken", timeToLive = 60 * 60 * 24 * 14)
public class RefreshTokenRedis {

    @Id
    private String tokenValue;

    private String email;


    @Builder
    private RefreshTokenRedis(String tokenValue, String email) {
        this.tokenValue = tokenValue;
        this.email = email;
    }

    public static RefreshTokenRedis from(RefreshToken refreshToken) {
        return RefreshTokenRedis.builder()
                .email(refreshToken.getEmail())
                .tokenValue(refreshToken.getTokenValue())
                .build();
    }

    public RefreshToken toDomain() {
        return RefreshToken.builder()
                .tokenValue(tokenValue)
                .email(email)
                .build();
    }

}
