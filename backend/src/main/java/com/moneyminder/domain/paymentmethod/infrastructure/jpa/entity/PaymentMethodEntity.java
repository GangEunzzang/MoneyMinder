package com.moneyminder.domain.paymentmethod.infrastructure.jpa.entity;

import com.moneyminder.domain.paymentmethod.domain.PaymentMethod;
import com.moneyminder.domain.paymentmethod.domain.type.PaymentKind;
import com.moneyminder.global.base.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE payment_method SET is_deleted = TRUE WHERE id = ?")
@SQLRestriction("is_deleted = false")
@Entity
@Table(name = "payment_method", indexes = {
        @Index(name = "idx_payment_method_user_email", columnList = "user_email")
})
public class PaymentMethodEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Comment("결제수단 고유 식별자")
    private Long id;

    @Column(nullable = false)
    @Comment("유저 이메일")
    private String userEmail;

    @Column(nullable = false, length = 30)
    @Comment("결제수단 이름")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Comment("결제수단 종류 (CARD, CASH, ACCOUNT)")
    private PaymentKind kind;

    @Column(length = 20)
    @Comment("팔레트 토큰 이름")
    private String color;

    @Comment("신용카드 결제일 (1~31). 카드가 아니면 없다")
    private Integer billingDay;

    @ColumnDefault("0")
    @Comment("목록 정렬 순서")
    private int sortOrder;

    @Comment("삭제 여부")
    @ColumnDefault("false")
    private Boolean isDeleted = Boolean.FALSE;

    @Builder
    private PaymentMethodEntity(Long id, String userEmail, String name, PaymentKind kind, String color,
            Integer billingDay, int sortOrder, boolean isDeleted) {
        this.id = id;
        this.userEmail = userEmail;
        this.name = name;
        this.kind = kind;
        this.color = color;
        this.billingDay = billingDay;
        this.sortOrder = sortOrder;
        this.isDeleted = isDeleted;
    }

    public static PaymentMethodEntity from(PaymentMethod paymentMethod) {
        return PaymentMethodEntity.builder()
                .id(paymentMethod.getId())
                .userEmail(paymentMethod.getUserEmail())
                .name(paymentMethod.getName())
                .kind(paymentMethod.getKind())
                .color(paymentMethod.getColor())
                .billingDay(paymentMethod.getBillingDay())
                .sortOrder(paymentMethod.getSortOrder())
                .build();
    }

    public PaymentMethod toDomain() {
        return PaymentMethod.builder()
                .id(id)
                .userEmail(userEmail)
                .name(name)
                .kind(kind)
                .color(color)
                .billingDay(billingDay)
                .sortOrder(sortOrder)
                .build();
    }
}
