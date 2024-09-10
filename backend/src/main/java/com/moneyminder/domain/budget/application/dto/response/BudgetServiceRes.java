package com.moneyminder.domain.budget.application.dto.response;

import com.moneyminder.domain.budget.domain.Budget;
import lombok.Builder;

import java.math.BigInteger;

@Builder
public record BudgetServiceRes(
        Long budgetId,
        Integer year,
        Integer month,
        String userEmail,
        BigInteger amount
) {

    public static BudgetServiceRes fromDomain(Budget budget) {
        return BudgetServiceRes.builder()
                .budgetId(budget.id())
                .year(budget.year())
                .month(budget.month())
                .userEmail(budget.userEmail())
                .amount(budget.amount())
                .build();
    }
}
