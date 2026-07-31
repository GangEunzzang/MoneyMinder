package com.moneyminder.domain.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moneyminder.domain.user.domain.User;
import com.moneyminder.domain.user.domain.type.SocialType;
import com.moneyminder.domain.user.domain.type.UserRole;
import com.moneyminder.global.exception.BaseException;
import java.util.function.BiPredicate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class UserTest {

    /** 대조 방식은 바깥이 정한다. 테스트에서는 평문 비교로 충분하다. */
    private static final BiPredicate<String, String> 평문대조 = String::equals;

    @Nested
    class 가입 {

        @DisplayName("일반 가입은 이메일 인증이 아직 되지 않은 상태로 시작한다.")
        @Test
        void whenNormalSignup_thenEmailNotVerified() {
            User user = User.normalCreate("test@moneyminder.com", "테스터", "비밀번호");

            assertThat(user.isEmailVerified()).isFalse();
            assertThat(user.isSocial()).isFalse();
            assertThat(user.getUserRole()).isEqualTo(UserRole.USER);
        }

        @DisplayName("소셜 가입은 이메일이 이미 확인된 것으로 본다.")
        @Test
        void whenSocialSignup_thenEmailVerified() {
            User user = User.socialCreate("test@moneyminder.com", "테스터", SocialType.GOOGLE);

            assertThat(user.isEmailVerified()).isTrue();
            assertThat(user.isSocial()).isTrue();
            assertThat(user.getPassword()).isNull();
        }

        @DisplayName("이메일이나 이름이 비면 만들 수 없다.")
        @Test
        void whenBlankEmailOrName_thenThrow() {
            assertThatThrownBy(() -> User.normalCreate("", "테스터", "비밀번호"))
                    .isInstanceOf(IllegalArgumentException.class);
            assertThatThrownBy(() -> User.normalCreate("test@moneyminder.com", "", "비밀번호"))
                    .isInstanceOf(IllegalArgumentException.class);
        }
    }

    @Nested
    class 비밀번호 {

        @DisplayName("맞는 비밀번호는 통과한다.")
        @Test
        void whenPasswordMatches_thenPass() {
            User user = User.normalCreate("test@moneyminder.com", "테스터", "비밀번호");

            assertThatCode(() -> user.validatePassword("비밀번호", 평문대조)).doesNotThrowAnyException();
        }

        @DisplayName("틀린 비밀번호는 막는다.")
        @Test
        void whenPasswordDiffers_thenThrow() {
            User user = User.normalCreate("test@moneyminder.com", "테스터", "비밀번호");

            assertThatThrownBy(() -> user.validatePassword("다른비밀번호", 평문대조))
                    .isInstanceOf(BaseException.class);
        }

        @DisplayName("소셜 가입자는 비밀번호가 없어 어떤 입력으로도 통과하지 않는다.")
        @Test
        void whenSocialUser_thenNeverPass() {
            User user = User.socialCreate("test@moneyminder.com", "테스터", SocialType.KAKAO);

            assertThatThrownBy(() -> user.validatePassword("아무거나", 평문대조))
                    .isInstanceOf(BaseException.class);
            assertThatThrownBy(() -> user.validatePassword(null, 평문대조))
                    .isInstanceOf(BaseException.class);
        }

        @DisplayName("비밀번호를 바꾸면 새 비밀번호로 통과한다.")
        @Test
        void whenPasswordChanged_thenNewOnePasses() {
            User user = User.normalCreate("test@moneyminder.com", "테스터", "비밀번호");

            user.changePassword("새비밀번호");

            assertThatCode(() -> user.validatePassword("새비밀번호", 평문대조)).doesNotThrowAnyException();
            assertThatThrownBy(() -> user.validatePassword("비밀번호", 평문대조)).isInstanceOf(BaseException.class);
        }
    }

    @Nested
    class 상태변경 {

        @DisplayName("이메일 인증을 마치면 인증 상태가 된다.")
        @Test
        void whenVerifyEmail_thenVerified() {
            User user = User.normalCreate("test@moneyminder.com", "테스터", "비밀번호");

            user.verifyEmail();

            assertThat(user.isEmailVerified()).isTrue();
        }

        @DisplayName("빈 이름으로는 바꿀 수 없다.")
        @Test
        void whenBlankName_thenThrow() {
            User user = User.normalCreate("test@moneyminder.com", "테스터", "비밀번호");

            assertThatThrownBy(() -> user.changeName("")).isInstanceOf(IllegalArgumentException.class);
        }
    }
}
