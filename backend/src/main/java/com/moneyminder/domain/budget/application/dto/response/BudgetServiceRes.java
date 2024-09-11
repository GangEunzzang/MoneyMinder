package com.moneyminder.domain.budget.application.dto.response;

import com.moneyminder.domain.budget.domain.Budget;
import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.type.CategoryType;
import com.querydsl.core.annotations.QueryProjection;
import lombok.Builder;

import java.math.BigInteger;

public record BudgetServiceRes(
        Long budgetId,
        Integer year,
        Integer month,
        BigInteger amount,
        String categoryCode,
        String categoryName,
        CategoryType categoryType
) {

    @QueryProjection
    @Builder
    public BudgetServiceRes {
    }

    public static BudgetServiceRes fromDomain(Budget budget, Category category) {
        return BudgetServiceRes.builder()
                .budgetId(budget.id())
                .year(budget.year())
                .month(budget.month())
                .amount(budget.amount())
                .categoryCode(category.categoryCode())
                .categoryName(category.categoryName())
                .categoryType(category.categoryType())
                .build();
    }
}
