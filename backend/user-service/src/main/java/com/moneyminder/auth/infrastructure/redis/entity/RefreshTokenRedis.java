package com.moneyminder.auth.infrastructure.redis.entity;

import com.moneyminder.auth.domain.RefreshToken;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@RedisHash(value = "RefreshToken", timeToLive = 60 * 60 * 24 * 14)
public class RefreshTokenRedis {

    @Id
    private final String tokenValue;

    private final String email;


    @Builder
    private RefreshTokenRedis(String tokenValue, String email) {
        this.tokenValue = tokenValue;
        this.email = email;
    }

    public RefreshToken toDomain() {
        return RefreshToken.builder()
                .tokenValue(tokenValue)
                .email(email)
                .build();
    }

}
