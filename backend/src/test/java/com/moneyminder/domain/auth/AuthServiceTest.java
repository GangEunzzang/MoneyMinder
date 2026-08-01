package com.moneyminder.domain.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moneyminder.domain.auth.application.AuthService;
import com.moneyminder.domain.auth.application.JwtProvider;
import com.moneyminder.domain.auth.domain.RefreshToken;
import com.moneyminder.domain.auth.domain.TokenInfo;
import com.moneyminder.domain.auth.domain.repository.RefreshTokenRepository;
import com.moneyminder.domain.user.domain.User;
import com.moneyminder.domain.user.domain.repository.UserRepository;
import com.moneyminder.domain.user.domain.type.SocialType;
import com.moneyminder.global.exception.BaseException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AuthServiceTest {

    private static final String EMAIL = "auth-service-test@moneyminder.com";

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private TokenInfo issued;

    @BeforeEach
    void setUp() {
        userRepository.deleteAllInBatch();
        refreshTokenRepository.deleteAllInBatch();

        User user = userRepository.save(User.socialCreate(EMAIL, "테스터", SocialType.GOOGLE));
        issued = jwtProvider.generateToken(user);
    }

    @Nested
    class 재발급 {

        @DisplayName("리프레시 토큰으로 새 토큰을 받는다.")
        @Test
        void whenValidRefreshToken_thenReissue() {
            TokenInfo reissued = authService.reissueToken(issued.refreshToken());

            assertThat(reissued.accessToken()).isNotBlank();
            assertThat(reissued.refreshToken()).isNotBlank();
        }

        /**
         * 쓰고 난 리프레시 토큰이 살아 있으면 탈취당한 토큰으로 계속 재발급할 수 있다.
         */
        @DisplayName("쓴 리프레시 토큰은 다시 쓸 수 없다.")
        @Test
        void whenReused_thenRejected() {
            String usedToken = issued.refreshToken();
            authService.reissueToken(usedToken);

            assertThatThrownBy(() -> authService.reissueToken(usedToken))
                    .isInstanceOf(BaseException.class);
        }

        @DisplayName("저장된 적 없는 토큰으로는 재발급하지 못한다.")
        @Test
        void whenUnknownToken_thenRejected() {
            String strayToken = jwtProvider.generateToken(
                            User.socialCreate("stranger@moneyminder.com", "낯선이", SocialType.NAVER))
                    .refreshToken();
            refreshTokenRepository.findByTokenValue(strayToken).ifPresent(refreshTokenRepository::delete);

            assertThatThrownBy(() -> authService.reissueToken(strayToken))
                    .isInstanceOf(BaseException.class);
        }

        @DisplayName("형식이 아닌 문자열은 재발급 요청으로 받지 않는다.")
        @Test
        void whenMalformed_thenRejected() {
            assertThatThrownBy(() -> authService.reissueToken("not.a.jwt"))
                    .isInstanceOf(BaseException.class);
        }
    }

    @Nested
    class 고유성 {

        /**
         * 토큰이 사용자와 무관한 값이면 Redis 키(토큰값)가 겹쳐 서로의 항목을 덮어쓴다.
         * 남의 토큰으로 내 계정 액세스 토큰이 나올 수 있다.
         */
        @DisplayName("다른 사용자가 같은 시각에 발급받아도 리프레시 토큰은 서로 다르다.")
        @Test
        void whenDifferentUsersAtSameMoment_thenTokensDiffer() {
            User other = userRepository.save(
                    User.socialCreate("other@moneyminder.com", "다른사람", SocialType.KAKAO));

            TokenInfo otherToken = jwtProvider.generateToken(other);

            assertThat(otherToken.refreshToken()).isNotEqualTo(issued.refreshToken());
        }

        @DisplayName("같은 사용자가 연달아 발급받아도 리프레시 토큰은 서로 다르다.")
        @Test
        void whenSameUserTwice_thenTokensDiffer() {
            User user = userRepository.findByEmail(EMAIL).orElseThrow();

            assertThat(jwtProvider.generateToken(user).refreshToken())
                    .isNotEqualTo(jwtProvider.generateToken(user).refreshToken());
        }
    }

    @Nested
    class 저장 {

        @DisplayName("토큰을 발급하면 리프레시 토큰이 저장된다.")
        @Test
        void whenIssued_thenRefreshTokenStored() {
            RefreshToken stored = refreshTokenRepository.findByTokenValue(issued.refreshToken()).orElseThrow();

            assertThat(stored.getEmail()).isEqualTo(EMAIL);
            assertThat(stored.matches(issued.refreshToken())).isTrue();
        }
    }
}
