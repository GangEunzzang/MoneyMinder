package com.moneyminder.domain.auth.jwt;

import com.moneyminder.domain.auth.application.JwtProvider;
import com.moneyminder.domain.auth.domain.TokenInfo;
import com.moneyminder.domain.auth.domain.repository.RefreshTokenRepository;
import com.moneyminder.domain.auth.properties.TokenProperties;
import com.moneyminder.domain.user.domain.User;
import com.moneyminder.domain.user.domain.repository.UserRepository;
import com.moneyminder.domain.user.domain.type.SocialType;
import com.moneyminder.domain.user.domain.type.UserRole;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.security.core.Authentication;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
class JwtProviderTest {

    @SpyBean
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private TokenProperties tokenProperties;

    private User setUpUser;

    private Key key;

    @BeforeEach
    void setUp() {
        userRepository.deleteAllInBatch();
        refreshTokenRepository.deleteAllInBatch();
        setUpUser = userRepository.save(User.builder()
                .email("testUser")
                .userRole(UserRole.USER)
                .name("name")
                .socialType(SocialType.GOOGLE)
                .build());

        byte[] keyBytes = Decoders.BASE64.decode(tokenProperties.getSecretKey());
        key = Keys.hmacShaKeyFor(keyBytes);
    }

    @Nested
    class 성공테스트 {

        @DisplayName("토큰 생성 시, 유효한 토큰을 반환해야 한다")
        @Test
        void given_userIdAndUserRole_when_generateToken_then_returnValidTokens() {
            // given && when
            TokenInfo tokenInfo = jwtProvider.generateToken(setUpUser.email(), UserRole.USER);

            // then
            assertDoesNotThrow(() -> jwtProvider.validateToken(tokenInfo.accessToken()));
            assertDoesNotThrow(() -> jwtProvider.validateToken(tokenInfo.refreshToken()));
        }

        @DisplayName("리프레시 토큰이 유효하면 엑세스 토큰을 재발급한다")
        @Test
        void given_refreshToken_when_validateRefreshToken_then_reissueAccessToken() throws Exception {
            // given
            TokenInfo currentTokenInfo = jwtProvider.generateToken(setUpUser.email(), UserRole.USER);

            // when
            TokenInfo reissuedTokenInfo = jwtProvider.reissueToken(currentTokenInfo.refreshToken());

            // then
            assertNotNull(reissuedTokenInfo.accessToken());
            assertNotNull(reissuedTokenInfo.refreshToken());
        }

        @DisplayName("엑세스 토큰 재발급 시 기존 리프레시 토큰은 폐기 후 새로 생성한다.")
        @Test
        void given_refreshToken_when_reissueAccessToken_then_regenerateRefreshToken() throws Exception {
            // given
            TokenInfo currentTokenInfo = jwtProvider.generateToken(setUpUser.email(), UserRole.USER);

            // when
            Thread.sleep(1000);
            TokenInfo reissueTokenInfo = jwtProvider.reissueToken(currentTokenInfo.refreshToken());

            // then
            assertNotEquals(currentTokenInfo.refreshToken(), reissueTokenInfo.refreshToken());
            assertThat(refreshTokenRepository.findByTokenValue(currentTokenInfo.refreshToken())).isEmpty();
            assertThat(refreshTokenRepository.findByTokenValue(reissueTokenInfo.refreshToken())).isPresent();
        }

        @DisplayName("토큰에서 사용자 권한을 추출한다")
        @Test
        void given_validAccessToken_when_getAuthentication_then_returnAuthentication() {
            // given
            TokenInfo tokenInfo = jwtProvider.generateToken(setUpUser.email(), UserRole.USER);

            // when
            Authentication authentication = jwtProvider.getAuthentication(tokenInfo.accessToken());

            // then
            assertThat(authentication).isNotNull();
            assertThat(authentication.getAuthorities()).hasSize(1);
            assertThat(authentication.getAuthorities().iterator().next().getAuthority()).isEqualTo(
                    UserRole.USER.getKey());
        }

        @DisplayName("HttpServletRequest에서 AccessToken을 추출한다")
        @Test
        void given_requestWithAccessToken_when_extractAccessToken_then_returnAccessToken() {
            // given
            HttpServletRequest request = mock(HttpServletRequest.class);
            String expectedToken = "test.token.value";
            when(request.getHeader(JwtProvider.AUTHORIZATION_HEADER)).thenReturn(
                    JwtProvider.BEARER_PREFIX + expectedToken);

            // when
            Optional<String> accessToken = jwtProvider.extractAccessToken(request);

            // then
            assertThat(accessToken).isPresent();
            assertThat(accessToken.get()).isEqualTo(expectedToken);
        }

        @DisplayName("HttpServletRequest에서 인증헤더가 존재하지 않거나 Bearer 토큰이 아닌 경우 빈값을 반환한다")
        @Test
        void given_requestWithoutAuthorizationHeader_when_extractAccessToken_then_returnEmpty() {
            // given
            HttpServletRequest request = mock(HttpServletRequest.class);
            when(request.getHeader(JwtProvider.AUTHORIZATION_HEADER)).thenReturn(null);

            // when
            Optional<String> accessToken = jwtProvider.extractAccessToken(request);

            // then
            assertThat(accessToken).isEmpty();
        }

        @DisplayName("HttpServletRequest에서 RefreshToken을 추출한다")
        @Test
        void given_requestWithRefreshToken_when_extractRefreshToken_then_returnRefreshToken() {
            // given
            HttpServletRequest request = mock(HttpServletRequest.class);
            String expectedToken = "test.token.value";
            when(request.getHeader(JwtProvider.REFRESH_TOKEN_HEADER)).thenReturn(
                    JwtProvider.BEARER_PREFIX + expectedToken);

            // when
            Optional<String> refreshToken = jwtProvider.extractRefreshToken(request);

            // then
            assertThat(refreshToken).isPresent();
            assertThat(refreshToken.get()).isEqualTo(expectedToken);
        }

        @DisplayName("HttpServletRequest에서 리프레시 토큰이 없거나 Bearer 토큰이 아닌 경우 빈값을 반환한다")
        @Test
        void given_requestWithoutRefreshToken_when_extractRefreshToken_then_returnEmpty() {
            // given
            HttpServletRequest request = mock(HttpServletRequest.class);
            when(request.getHeader(JwtProvider.REFRESH_TOKEN_HEADER)).thenReturn(null);

            // when
            Optional<String> refreshToken = jwtProvider.extractRefreshToken(request);

            // then
            assertThat(refreshToken).isEmpty();
        }


    }

    @Nested
    class 예외테스트 {

        @DisplayName("유효하지 않은 토큰을 검증할 때, 예외가 발생해야 한다")
        @Test
        void given_invalidToken_when_validateToken_then_throwJwtException() {
            // given
            String invalidToken = "invalid.token.value";

            // when & then
            assertThatThrownBy(() -> jwtProvider.validateToken(invalidToken))
                    .isInstanceOf(BaseException.class)
                    .hasMessageContaining(ResultCode.JWT_INVALID_SIGN.getMessage());
        }

        @DisplayName("잘못된 서명이 있는 토큰을 검증하면 예외를 발생시킨다")
        @Test
        void given_invalidSignatureToken_when_validateToken_then_throwException() {
            // given
            String invalidSignatureToken = Jwts.builder()
                    .setSubject("testUser")
                    .claim(JwtProvider.AUTHORITIES_KEY, UserRole.USER.getKey())
                    .setExpiration(Date.from(Instant.now().plusMillis(tokenProperties.getAccessTokenExpiry())))
                    .signWith(SignatureAlgorithm.HS256, "invalidKeysfdasfdasdfasdfasdfasdfasdfasdfasfd".getBytes())
                    .compact();

            // when && then
            assertThatThrownBy(() -> jwtProvider.validateToken(invalidSignatureToken))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.JWT_INVALID_SIGN.getMessage());
        }

        @DisplayName("만료된 리프레시 토큰으로 새로운 액세스 토큰을 재발급할 때, 예외가 발생해야 한다")
        @Test
        void given_expiredRefreshToken_when_reissueAccessToken_then_throwJwtException() {
            // given
            String expiredToken = Jwts.builder()
                    .setSubject("testUser")
                    .claim(JwtProvider.AUTHORIZATION_HEADER, UserRole.USER.getKey())
                    .setExpiration(Date.from(Instant.now().minusMillis(1))) // 만료된 토큰
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();

            // when & then
            assertThatThrownBy(() -> jwtProvider.reissueToken(expiredToken))
                    .isInstanceOf(BaseException.class)
                    .hasMessageContaining(ResultCode.JWT_EXPIRED.getMessage());
        }


        @DisplayName("잘못된 형식의 토큰을 검증하면 예외를 발생시킨다")
        @Test
        void given_illegalFormatToken_when_validateToken_then_throwException() {
            // given
            String illegalFormatToken = "illegalFormatToken";

            // when && then
            assertThatThrownBy(() -> jwtProvider.validateToken(illegalFormatToken))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.JWT_INVALID_SIGN.getMessage());
        }


        @DisplayName("만료된 액세스 토큰을 가지고 인증 시도시 예외를 발생시킨다.")
        @Test
        void given_expiredAccessToken_when_getAuthentication_then_returnAuthentication() {
            // given
            String expiredToken = Jwts.builder()
                    .setSubject("testUser")
                    .claim(JwtProvider.AUTHORITIES_KEY, UserRole.USER.getKey())
                    .setExpiration(Date.from(Instant.now().minusMillis(1))) // 만료된 토큰
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();

            // when & then
            assertThatThrownBy(() -> jwtProvider.getAuthentication(expiredToken))
                    .isInstanceOf(BaseException.class)
                    .hasMessageContaining(ResultCode.JWT_EXPIRED.getMessage());
        }

        @DisplayName("인증 객체를 가져올 때 claims에 Authorization 키가 없으면 예외를 발생시킨다")
        @Test
        void given_invalidClaims_when_getAuthentication_then_throwException() {
            // given
            String invalidClaimsToken = Jwts.builder()
                    .setSubject("testUser")
                    .setExpiration(Date.from(Instant.now().plusMillis(tokenProperties.getAccessTokenExpiry())))
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();

            // when && then
            assertThatThrownBy(() -> jwtProvider.getAuthentication(invalidClaimsToken))
                    .isInstanceOf(BaseException.class)
                    .hasMessageContaining(ResultCode.JWT_INVALID.getMessage());
        }


    }
}
