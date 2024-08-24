package com.moneyminder.domain.auth.properties;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties("auth.oauth2")
public class OAuth2Properties {

    List<String> authorizedRedirectUris = new ArrayList<>();
}
