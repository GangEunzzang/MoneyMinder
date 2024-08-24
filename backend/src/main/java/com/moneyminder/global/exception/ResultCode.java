package com.moneyminder.global.exception;

import java.util.Optional;
import java.util.function.Predicate;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ResultCode {

    SUCCESS(200, HttpStatus.OK, "성공"),
    INTERNAL_ERROR(500, HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류 발생"),
    INVALID_INPUT_VALUE(400, HttpStatus.BAD_REQUEST, "유효성 검증 실패"),

    //user
    USER_NOT_FOUND(404, HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
    USER_ALREADY_EXISTS(409, HttpStatus.CONFLICT, "이미 존재하는 사용자입니다."),
    INVALID_EMAIL(400, HttpStatus.BAD_REQUEST, "이메일 형식이 올바르지 않습니다."),
    USER_EMAIL_NOT_BLANK(400, HttpStatus.BAD_REQUEST, "이메일은 공백일 수 없습니다."),
    USER_NAME_LENGTH(400, HttpStatus.BAD_REQUEST, "이름은 1자 이상 20자 이하여야 합니다."),
    NOT_FOUND_ROLE(404, HttpStatus.NOT_FOUND, "일치하는 유저 권한을 찾을 수 없습니다"),


    // jwt
    JWT_NOT_FOUND(404, HttpStatus.NOT_FOUND, "토큰을 찾을 수 없습니다."),
    JWT_INVALID_SIGN(401, HttpStatus.UNAUTHORIZED, "잘못된 서명"),
    JWT_EXPIRED(403, HttpStatus.UNAUTHORIZED, "만료된 토큰"),
    JWT_UNSUPPORTED(400, HttpStatus.BAD_REQUEST, "지원되지 않는 토큰"),
    JWT_INVALID(400, HttpStatus.BAD_REQUEST,  "올바르지 않은 토큰"),
    JWT_PROCESS_ERROR(500, HttpStatus.INTERNAL_SERVER_ERROR,  "토큰 처리 에러"),

    // accountBook
    ACCOUNT_BOOK_NOT_FOUND(404, HttpStatus.NOT_FOUND, "가계부 데이터를 찾을 수 없습니다."),
    ACCOUNT_BOOK_FORBIDDEN(403, HttpStatus.FORBIDDEN, "데이터에 접근 권한이 없습니다."),

    // category
    CATEGORY_NOT_FOUND(404, HttpStatus.NOT_FOUND, "카테고리를 찾을 수 없습니다."),
    CATEGORY_BOOK_FORBIDDEN(403, HttpStatus.FORBIDDEN, "데이터에 접근 권한이 없습니다."),

    ;
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
