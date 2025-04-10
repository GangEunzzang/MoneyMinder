package com.moneyminder.auth;

import com.moneyminder.dto.JwtClaims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;

import java.util.Optional;

public interface JwtProvider {

    /**
     * JWT access 토큰을 생성합니다.
     *
     * @param claims JWT에 담을 Claims 정보
     * @return 생성된 JWT 토큰
     */
    String generateAccessToken(JwtClaims claims);


    /**
     * JWT refresh 토큰을 생성합니다.
     *
     * @return 생성된 JWT 토큰
     */
    String generateRefreshToken();

    /**
     * HTTP 요청에서 Authorization 헤더에 담긴 JWT 토큰을 추출합니다.
     *
     * @param request HTTP 요청
     * @return JWT 토큰
     */
    Optional<String> extractAccessToken(HttpServletRequest request);

    /**
     * JWT refresh 토큰을 추출합니다.
     *
     * @param request HTTP 요청
     * @return JWT refresh 토큰
     */
    Optional<String> extractRefreshToken(HttpServletRequest request);

    /**
     * Token에서 Authentication 객체를 반환합니다.
     *
     * @param accessToken JWT 토큰
     * @return Authentication 객체
     * @throws RuntimeException 토큰이 유효하지 않을 경우 예외 발생
     */
    Authentication getAuthentication(String accessToken);

    /**
     * HTTP 요청에서 Authorization 헤더에 담긴 JWT 토큰을 추출한 후,
     * 토큰이 유효하다면 사용자의 이메일(혹은 고유 식별자)을 반환합니다.
     *
     * @param request HTTP 요청
     * @return 토큰에서 추출한 사용자의 이메일
     * @throws RuntimeException 토큰이 없거나 유효하지 않을 경우 예외 발생
     */
    String getEmailByRequest(HttpServletRequest request);

    /**
     * 전달된 JWT 토큰의 유효성을 검사합니다.
     *
     * @param token JWT 토큰 문자열
     * @return 유효하면 true, 아니면 false
     */
    boolean validateToken(String token);
}
