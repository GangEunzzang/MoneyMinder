package com.moneyminder.domain.user.entity;

import com.moneyminder.domain.user.type.SocialType;
import com.moneyminder.global.base.BaseTime;
import com.moneyminder.domain.user.type.UserRole;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import org.springframework.util.Assert;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "users")
public class User extends BaseTime {

    private static final String EMAIL_REGEX = "^([\\w._\\-])*[a-zA-Z0-9]+([\\w._\\-])*([a-zA-Z0-9])+([\\w._\\-])+@([a-zA-Z0-9]+\\.)+[a-zA-Z0-9]{2,8}$";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    @Comment("사용자 고유 식별자")
    private Long id;

    @Column(unique = true)
    @Comment("사용자 이메일")
    private String email;

    @Comment("사용자 이름")
    private String name;

    @Enumerated(EnumType.STRING)
    @Comment("유저 권한")
    private UserRole userRole;

    @Enumerated(EnumType.STRING)
    @Comment("가입 소셜 종류")
    private SocialType socialType;

    @Builder
    private User(String email, String name, UserRole userRole, SocialType socialType) {
        validation(email, name, socialType);
        this.email = email;
        this.name = name;
        this.userRole = userRole == null ? UserRole.USER : userRole;
        this.socialType = socialType;
    }

    private void validation(String email, String name, SocialType socialType) {
        Assert.notNull(email, "email must not be empty");
        Assert.notNull(name, "name must not be empty");
        Assert.notNull(socialType, "socialType must not be empty");
    }

    public static User of(String email, String name, SocialType socialType) {
        return User.builder()
                .email(email)
                .name(name)
                .userRole(UserRole.USER)
                .socialType(socialType)
                .build();
    }

    public static User of(String email, String name, SocialType socialType, UserRole role) {
        return User.builder()
                .email(email)
                .name(name)
                .userRole(role)
                .socialType(socialType)
                .build();
    }
}
