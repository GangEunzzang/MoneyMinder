package com.moneyminder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.moneyminder.accountbookservice", "com.moneyminder.moneymindercommon"})
public class AccountBookServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AccountBookServiceApplication.class, args);
    }

}
