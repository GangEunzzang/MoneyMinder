package com.moneyminder.common.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class LoggingAspect {

    @Around("execution(* com.moneyminder.api.controller..*(..))")
    public Object logException(ProceedingJoinPoint joinPoint) throws Throwable {
        Object result;
        try {
            result = joinPoint.proceed();
        } catch (Exception e) {
            StackTraceElement topElement = e.getStackTrace()[0];
            log.error("Error occurred in {}.{} at line {}: {}",
                    topElement.getClassName(),
                    topElement.getMethodName(),
                    topElement.getLineNumber(),
                    e.getMessage());
            throw eg
        }

        return result;
    }
}