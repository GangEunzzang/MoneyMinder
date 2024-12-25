package com.moneyminder.global.config;

import net.gpedro.integrations.slack.SlackApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SlackConfig {

    @Value("${slack.webhook-url}")
    private String slackWebhookUrl;

    @Bean
    public SlackApi slackApi() {
        return new SlackApi(slackWebhookUrl);
    }

}