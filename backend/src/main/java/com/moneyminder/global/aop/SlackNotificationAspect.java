package com.moneyminder.global.aop;

import com.moneyminder.global.application.SlackService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Profile("dev")
@RequiredArgsConstructor
public class SlackNotificationAspect {

    private final SlackService slackService;

    @Around("@annotation(com.moneyminder.global.annotaion.SlackNotification) && args(request, exception)")
    public Object sendSlack(ProceedingJoinPoint joinPoint, HttpServletRequest request, Exception exception)
            throws Throwable {
        slackService.send(request, exception);

        return joinPoint.proceed();
    }
}