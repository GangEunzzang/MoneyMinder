package com.moneyminder.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Optional;
import java.util.function.Predicate;

@Getter
public enum ResultCode {

    SUCCESS(200, HttpStatus.OK, "성공"),
    INTERNAL_ERROR(500, HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류 발생");

    private final Integer code;
    private final HttpStatus httpStatus;
    private final String message;

    ResultCode(Integer code, HttpStatus httpStatus, String message) {
        this.code = code;
        this.httpStatus = httpStatus;
        this.message = message;
    }

    public String getMessage(Throwable e) {
        return this.getMessage(this.getMessage() + " - " + e.getMessage());
    }

    public String getMessage(String message) {
        return Optional.ofNullable(message)
                .filter(Predicate.not(String::isBlank))
                .orElse(this.getMessage());
    }

    @Override
    public String toString() {
        return String.format("%s (%d)", this.name(), this.getCode());
    }

}
