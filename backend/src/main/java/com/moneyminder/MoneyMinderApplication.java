package com.moneyminder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class MoneyMinderApplication {

    public static void main(String[] args) {
        SpringApplication.run(MoneyMinderApplication.class, args);
    }

}
