package com.moneyminder.domain.user.entity;


import com.moneyminder.global.base.BaseTime;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.util.Assert;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class RefreshToken extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "tokenValue", nullable = false)
    private String tokenValue;

    @Builder
    private RefreshToken(String email, String tokenValue) {
        validate(email, tokenValue);
        this.email = email;
        this.tokenValue = tokenValue;
    }

    public static RefreshToken of(String email, String tokenValue) {
        return RefreshToken.builder()
                .email(email)
                .tokenValue(tokenValue)
                .build();
    }

    private void validate(String email, String tokenValue) {
        Assert.notNull(email, "email must not be empty");
        Assert.notNull(tokenValue, "tokenValue must not be empty");
    }

    public void changeTokenValue(String tokenValue) {
        this.tokenValue = tokenValue;
    }

}
