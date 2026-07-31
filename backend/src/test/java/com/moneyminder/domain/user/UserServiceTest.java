package com.moneyminder.domain.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moneyminder.domain.auth.domain.TokenInfo;
import com.moneyminder.domain.user.application.UserService;
import com.moneyminder.domain.user.application.dto.request.UserServiceLoginReq;
import com.moneyminder.domain.user.application.dto.request.UserServiceSignupReq;
import com.moneyminder.domain.user.domain.User;
import com.moneyminder.domain.user.domain.repository.UserRepository;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UserServiceTest {

    private static final String EMAIL = "user-service-test@moneyminder.com";
    private static final String PASSWORD = "비밀번호";

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAllInBatch();
    }

    private void 가입해둔다() {
        userService.signup(UserServiceSignupReq.builder()
                .email(EMAIL)
                .name("테스터")
                .password(PASSWORD)
                .build());
    }

    @Nested
    class 회원가입 {

        @DisplayName("가입하면 조회할 수 있다.")
        @Test
        void whenSignup_thenFindable() {
            가입해둔다();

            User saved = userRepository.findByEmail(EMAIL).orElseThrow();

            assertThat(saved.getName()).isEqualTo("테스터");
            assertThat(saved.isEmailVerified()).isFalse();
        }

        @DisplayName("비밀번호는 평문으로 저장되지 않는다.")
        @Test
        void whenSignup_thenPasswordEncoded() {
            가입해둔다();

            User saved = userRepository.findByEmail(EMAIL).orElseThrow();

            assertThat(saved.getPassword()).isNotEqualTo(PASSWORD);
        }
    }

    @Nested
    class 로그인 {

        @DisplayName("맞는 비밀번호로 로그인하면 토큰을 준다.")
        @Test
        void whenValidCredentials_thenIssueToken() {
            가입해둔다();

            TokenInfo tokenInfo = userService.login(UserServiceLoginReq.builder()
                    .email(EMAIL)
                    .password(PASSWORD)
                    .build());

            assertThat(tokenInfo.accessToken()).isNotBlank();
            assertThat(tokenInfo.refreshToken()).isNotBlank();
        }

        @DisplayName("비밀번호가 틀리면 로그인하지 못한다.")
        @Test
        void whenWrongPassword_thenThrow() {
            가입해둔다();

            assertThatThrownBy(() -> userService.login(UserServiceLoginReq.builder()
                    .email(EMAIL)
                    .password("틀린비밀번호")
                    .build()))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.INVALID_PASSWORD.getMessage());
        }

        @DisplayName("없는 계정으로는 로그인하지 못한다.")
        @Test
        void whenUnknownEmail_thenThrow() {
            assertThatThrownBy(() -> userService.login(UserServiceLoginReq.builder()
                    .email("nobody@moneyminder.com")
                    .password(PASSWORD)
                    .build()))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.USER_NOT_FOUND.getMessage());
        }
    }
}
