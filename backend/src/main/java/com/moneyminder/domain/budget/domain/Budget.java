package com.moneyminder.domain.budget.domain;

import com.moneyminder.domain.budget.application.dto.request.BudgetServiceCreateReq;
import com.moneyminder.domain.budget.application.dto.request.BudgetServiceUpdateReq;
import com.moneyminder.domain.budget.infrastructure.jpa.entity.BudgetEntity;
import lombok.Builder;
import org.springframework.util.Assert;

import java.math.BigInteger;

public record Budget(

        Long id,
        Integer year,
        Integer month,
        BigInteger amount,
        String userEmail
) {

    @Builder
    public Budget {
        Assert.isTrue(year.toString().length() == 4, "year must be 4 digits");
        Assert.isTrue(month >= 1 && month <= 12, "month must be between 1 and 12");
        Assert.notNull(amount, "amount must not be null");
        Assert.notNull(userEmail, "userEmail must not be null");
    }

    public static Budget create(BudgetServiceCreateReq create) {
        return Budget.builder()
                .year(create.year())
                .month(create.month())
                .userEmail(create.userEmail())
                .amount(create.amount())
                .build();
    }

    public Budget update(BudgetServiceUpdateReq update) {
        return Budget.builder()
                .id(id)
                .year(year)
                .month(month)
                .userEmail(userEmail)
                .amount(update.amount())
                .build();
    }

    public BudgetEntity toEntity() {
        return BudgetEntity.builder()
                .id(id)
                .budgetYear(year)
                .budgetMonth(month)
                .amount(amount)
                .userEmail(userEmail)
                .build();
    }


}
