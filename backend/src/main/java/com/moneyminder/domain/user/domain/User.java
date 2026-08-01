package com.moneyminder.domain.user.domain;

import com.moneyminder.domain.user.domain.type.SocialType;
import com.moneyminder.domain.user.domain.type.UserRole;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import io.jsonwebtoken.lang.Assert;
import java.util.function.BiPredicate;
import lombok.Builder;
import lombok.Getter;

@Getter
public class User {

    private final Long id;
    private final String email;
    private final SocialType socialType;
    private String name;
    private String password;
    private UserRole userRole;
    private boolean isEmailVerified;

    @Builder
    private User(Long id, String email, String name, String password, UserRole userRole, SocialType socialType,
            boolean isEmailVerified) {
        Assert.hasText(email, "email must not be empty");
        Assert.hasText(name, "name must not be empty");
        Assert.notNull(socialType, "socialType must not be null");

        this.id = id;
        this.email = email;
        this.name = name;
        this.password = password;
        this.userRole = userRole == null ? UserRole.USER : userRole;
        this.socialType = socialType;
        this.isEmailVerified = isEmailVerified;
    }

    public static User create(String email, String name, String password, SocialType socialType) {
        return User.builder()
                .email(email)
                .name(name)
                .password(password)
                .userRole(UserRole.USER)
                .socialType(socialType)
                .isEmailVerified(socialType != SocialType.NORMAL)
                .build();
    }

    public static User normalCreate(String email, String name, String password) {
        return User.builder()
                .email(email)
                .name(name)
                .password(password)
                .userRole(UserRole.USER)
                .socialType(SocialType.NORMAL)
                .isEmailVerified(false)
                .build();
    }

    public static User socialCreate(String email, String name, SocialType socialType) {
        return User.builder()
                .email(email)
                .name(name)
                .password(null)
                .userRole(UserRole.USER)
                .socialType(socialType)
                .isEmailVerified(true)
                .build();
    }

    /**
     * 대조 방식은 바깥이 정하고, 무엇과 대조할지는 도메인이 안다.
     * 소셜 가입자는 비밀번호가 없으므로 어떤 입력으로도 통과하지 않는다.
     */
    public void validatePassword(String rawPassword, BiPredicate<String, String> passwordMatcher) {
        if (isSocial() || password == null || !passwordMatcher.test(rawPassword, password)) {
            throw new BaseException(ResultCode.INVALID_PASSWORD);
        }
    }

    public boolean isSocial() {
        return socialType != SocialType.NORMAL;
    }

    public void changeName(String name) {
        Assert.hasText(name, "name must not be empty");

        this.name = name;
    }

    public void changePassword(String encodedPassword) {
        Assert.hasText(encodedPassword, "password must not be empty");

        this.password = encodedPassword;
    }

    public void verifyEmail() {
        this.isEmailVerified = true;
    }

    public boolean isAdmin() {
        return UserRole.ADMIN.equals(userRole);
    }
}
