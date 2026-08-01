package com.moneyminder.domain.auth;

import static org.assertj.core.api.Assertions.assertThat;

import com.moneyminder.ControllerTest;
import com.moneyminder.domain.auth.properties.TokenProperties;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.restassured.RestAssured;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

/**
 * 필터에서 던진 예외는 DispatcherServlet 앞이라 @RestControllerAdvice 를 거치지 않는다.
 * 응답이 500 으로 새면 클라이언트가 "만료"와 "장애"를 구별할 수 없으므로 상태 코드를 직접 확인한다.
 */
class JwtAuthenticationFilterTest extends ControllerTest {

    @Autowired
    private TokenProperties tokenProperties;

    @Nested
    class 인증실패 {

        @DisplayName("토큰이 없으면 401 을 준다.")
        @Test
        void whenNoToken_thenUnauthorized() {
            ExtractableResponse<Response> response = RestAssured.given().log().all()
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .when().get("/api/v1/accountBook/email")
                    .then().log().all()
                    .extract();

            assertThat(response.statusCode()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
        }

        @DisplayName("만료된 토큰이면 500 이 아니라 401 을 준다.")
        @Test
        void whenExpiredToken_thenUnauthorized() {
            ExtractableResponse<Response> response = RestAssured.given().log().all()
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + expiredToken())
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .when().get("/api/v1/accountBook/email")
                    .then().log().all()
                    .extract();

            assertThat(response.statusCode()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
        }

        @DisplayName("서명이 다른 토큰이면 401 을 준다.")
        @Test
        void whenTamperedToken_thenUnauthorized() {
            ExtractableResponse<Response> response = RestAssured.given().log().all()
                    .header(HttpHeaders.AUTHORIZATION, "Bearer this.is.not.a.jwt")
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .when().get("/api/v1/accountBook/email")
                    .then().log().all()
                    .extract();

            assertThat(response.statusCode()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
        }

        @DisplayName("인증 실패 응답도 공통 에러 규격을 따른다.")
        @Test
        void whenUnauthorized_thenErrorResponseShape() {
            ExtractableResponse<Response> response = RestAssured.given().log().all()
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .when().get("/api/v1/accountBook/email")
                    .then().log().all()
                    .extract();

            assertThat(response.jsonPath().getString("message")).isNotBlank();
        }
    }

    @Nested
    class 노출차단 {

        @DisplayName("actuator 의 설정·힙덤프는 밖에서 열리지 않는다.")
        @Test
        void whenActuatorSensitiveEndpoint_thenNotExposed() {
            for (String path : new String[]{"/actuator/env", "/actuator/heapdump", "/actuator/beans"}) {
                ExtractableResponse<Response> response = RestAssured.given()
                        .when().get(path)
                        .then().extract();

                assertThat(response.statusCode())
                        .as("%s 가 공개돼 있다", path)
                        .isNotEqualTo(HttpStatus.OK.value());
            }
        }

        @DisplayName("헬스체크는 인증에 막히지 않는다.")
        @Test
        void whenActuatorHealth_thenNotBlockedByAuth() {
            ExtractableResponse<Response> response = RestAssured.given()
                    .when().get("/actuator/health")
                    .then().extract();

            assertThat(response.statusCode())
                    .as("본문: %s", response.body().asString())
                    .isNotIn(HttpStatus.UNAUTHORIZED.value(), HttpStatus.FORBIDDEN.value());
        }
    }

    private String expiredToken() {
        Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(tokenProperties.getSecretKey()));

        return Jwts.builder()
                .setSubject("expired@moneyminder.com")
                .setExpiration(Date.from(Instant.now().minusSeconds(60)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
