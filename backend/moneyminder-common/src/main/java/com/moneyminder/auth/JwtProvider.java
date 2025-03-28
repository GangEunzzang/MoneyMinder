package com.moneyminder.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;

public interface JwtProvider {

    /**
     * Token에서 Authentication 객체를 반환합니다.
     *
     * @param accessToken JWT 토큰
     * @return Authentication 객체
     * @throws RuntimeException 토큰이 유효하지 않을 경우 예외 발생
     */
    Authentication getAuthentication(String accessToken) {

        /**
         * HTTP 요청에서 Authorization 헤더에 담긴 JWT 토큰을 추출한 후,
         * 토큰이 유효하다면 사용자의 이메일(혹은 고유 식별자)을 반환합니다.
         *
         * @param request HTTP 요청
         * @return 토큰에서 추출한 사용자의 이메일
         * @throws RuntimeException 토큰이 없거나 유효하지 않을 경우 예외 발생
         */
        String getEmailByRequest (HttpServletRequest request)

        /**
         * 전달된 JWT 토큰의 유효성을 검사합니다.
         *
         * @param token JWT 토큰 문자열
         * @return 유효하면 true, 아니면 false
         */
        boolean validateToken (String token)
    }
