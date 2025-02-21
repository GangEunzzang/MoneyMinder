package com.moneyminder.domain.user.infrastructure.jpa.entity;

import com.moneyminder.domain.user.domain.User;
import com.moneyminder.domain.user.domain.type.SocialType;
import com.moneyminder.domain.user.domain.type.UserRole;
import com.moneyminder.domain.user.infrastructure.jpa.converter.UserPasswordConverter;
import com.moneyminder.global.base.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "users")
public class UserEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Comment("사용자 고유 식별자")
    private Long id;

    @Column(unique = true)
    @Comment("사용자 이메일")
    private String email;

    @Comment("사용자 이름")
    private String name;

    @Convert(converter = UserPasswordConverter.class)
    @Comment("사용자 비밀번호")
    private String password;

    @Enumerated(EnumType.STRING)
    @Comment("유저 권한")
    private UserRole userRole;

    @Enumerated(EnumType.STRING)
    @Comment("가입 소셜 종류")
    private SocialType socialType;

    @Comment("이메일 인증 여부")
    private Boolean isEmailVerified = false;

    @Builder
    private UserEntity(Long id, String email, String name, String password, UserRole userRole, SocialType socialType,
                       Boolean isEmailVerified) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.password = password;
        this.userRole = userRole == null ? UserRole.USER : userRole;
        this.socialType = socialType;
        this.isEmailVerified = isEmailVerified;
    }

    public User toDomain() {
        return User.builder()
                .id(id)
                .email(email)
                .name(name)
                .password(password)
                .userRole(userRole)
                .socialType(socialType)
                .isEmailVerified(isEmailVerified)
                .build();
    }
}

