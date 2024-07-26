package com.moneyminder.domain.auth.infrastructure.jpa.entity;


import com.moneyminder.domain.auth.domain.RefreshToken;
import com.moneyminder.global.base.BaseTime;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "refresh_token")
public class RefreshTokenEntity extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "tokenValue", nullable = false)
    private String tokenValue;

    @Builder
    private RefreshTokenEntity(Long id, String email, String tokenValue) {
        this.id = id;
        this.email = email;
        this.tokenValue = tokenValue;
    }

    public RefreshToken toDomain() {
        return RefreshToken.builder()
                .email(email)
                .tokenValue(tokenValue)
                .build();
    }

}
