package com.moneyminder.domain.auth.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties("auth.token")
public class TokenProperties {

    private String secretKey;
    private long accessTokenExpiry;
    private long refreshTokenExpiry;
}
