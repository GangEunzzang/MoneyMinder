package com.moneyminder.domain.budget.infrastructure.jpa.entity;

import com.moneyminder.domain.budget.domain.Budget;
import com.moneyminder.global.base.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import java.math.BigInteger;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "budget", indexes = {
        @Index(name = "idx_budget_user_email", columnList = "user_email")
})
public class BudgetEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Comment("예산 고유 식별자")
    private Long id;

    @Comment("예산 연도)")
    @Column(nullable = false, length = 4)
    private Integer budgetYear;

    @Comment("예산 월")
    @Column(nullable = false, length = 2)
    private Integer budgetMonth;

    @Comment("예산 금액")
    private BigInteger amount = BigInteger.ZERO;

    @Comment("카테고리 코드")
    private String categoryCode;

    @Comment("유저 이메일")
    private String userEmail;

    @Builder
    private BudgetEntity(Long id, Integer budgetYear, Integer budgetMonth, BigInteger amount, String categoryCode, String userEmail) {
        this.id = id;
        this.budgetYear = budgetYear;
        this.budgetMonth = budgetMonth;
        this.amount = amount;
        this.categoryCode = categoryCode;
        this.userEmail = userEmail;
    }

    public Budget toDomain() {
        return Budget.builder()
                .id(id)
                .year(budgetYear)
                .month(budgetMonth)
                .amount(amount)
                .userEmail(userEmail)
                .categoryCode(categoryCode)
                .build();
    }
}
