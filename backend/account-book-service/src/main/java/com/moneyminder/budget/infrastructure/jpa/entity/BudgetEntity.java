package com.moneyminder.budget.infrastructure.jpa.entity;

import com.moneyminder.base.BaseTimeEntity;
import com.moneyminder.budget.domain.Budget;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.math.BigInteger;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED, force = true)
@Entity
@Table(name = "budget", indexes = {
        @Index(name = "idx_budget_user_email", columnList = "user_email")
})
public class BudgetEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Comment("예산 고유 식별자")
    private final Long id;

    @Comment("예산 연도)")
    @Column(nullable = false, length = 4)
    private final Integer budgetYear;

    @Comment("예산 월")
    @Column(nullable = false, length = 2)
    private final Integer budgetMonth;

    @Comment("예산 금액")
    private BigInteger amount = BigInteger.ZERO;

    @Comment("카테고리 코드")
    private final String categoryCode;

    @Comment("유저 이메일")
    private final String userEmail;

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
