package com.moneyminder.user.feign;

import com.fasterxml.jackson.databind.ObjectMapper;
import feign.codec.Decoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserFeignConfig {

    @Bean
    public Decoder feignDecoder(ObjectMapper objectMapper) {
        return new UserApiResponseDecoder(objectMapper);
    }
}