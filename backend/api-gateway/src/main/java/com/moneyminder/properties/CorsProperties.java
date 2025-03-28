package com.moneyminder.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Component
@ConfigurationProperties("auth.cors")
public class CorsProperties {

    private final List<String> allowedOrigins = new ArrayList<>();
    private final List<String> allowedMethods = new ArrayList<>();
    private final List<String> allowedHeaders = new ArrayList<>();
    private long maxAge;

}
