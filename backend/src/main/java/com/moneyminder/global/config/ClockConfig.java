package com.moneyminder.global.config;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 결제일·자동기록은 "오늘" 이 무엇이냐에 따라 답이 달라진다.
 * LocalDate.now() 를 직접 부르면 그 분기를 테스트에서 고정할 수 없다.
 */
@Configuration
public class ClockConfig {

    @Bean
    public Clock clock() {
        return Clock.systemDefaultZone();
    }
}
