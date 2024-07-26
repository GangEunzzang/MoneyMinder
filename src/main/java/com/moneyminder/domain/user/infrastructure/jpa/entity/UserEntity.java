package com.moneyminder.domain.user.infrastructure.jpa.entity;

import com.moneyminder.domain.user.domain.User;
import com.moneyminder.domain.user.domain.type.SocialType;
import com.moneyminder.global.base.BaseTime;
import com.moneyminder.domain.user.domain.type.UserRole;
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
public class UserEntity extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    private UserEntity(Long id, String email, String name, UserRole userRole, SocialType socialType) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.userRole = userRole == null ? UserRole.USER : userRole;
        this.socialType = socialType;
    }

    public static UserEntity of(String email, String name, SocialType socialType) {
        return UserEntity.builder()
                .email(email)
                .name(name)
                .userRole(UserRole.USER)
                .socialType(socialType)
                .build();
    }

    public User toDomain() {
        return User.builder()
                .id(id)
                .email(email)
                .name(name)
                .userRole(userRole)
                .socialType(socialType)
                .build();
    }
}
