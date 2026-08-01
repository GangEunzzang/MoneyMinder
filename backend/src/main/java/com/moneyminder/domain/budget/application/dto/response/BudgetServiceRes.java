package com.moneyminder.domain.budget.application.dto.response;

import com.moneyminder.domain.budget.domain.Budget;
import com.moneyminder.domain.budget.domain.BudgetWithCategory;
import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.type.CategoryType;
import java.math.BigInteger;
import lombok.Builder;

public record BudgetServiceRes(
        Long budgetId,
        Integer year,
        Integer month,
        BigInteger amount,
        String categoryCode,
        String categoryName,
        CategoryType categoryType
) {

    @Builder
    public BudgetServiceRes {
    }

    public static BudgetServiceRes from(BudgetWithCategory withCategory) {
        return BudgetServiceRes.builder()
                .budgetId(withCategory.budgetId())
                .year(withCategory.year())
                .month(withCategory.month())
                .amount(withCategory.amount())
                .categoryCode(withCategory.categoryCode())
                .categoryName(withCategory.categoryName())
                .categoryType(withCategory.categoryType())
                .build();
    }

    /** 총액 예산은 카테고리가 없다. 기본 카테고리로 채우면 그 달 한도가 "기타" 예산처럼 보인다. */
    public static BudgetServiceRes forTotal(Budget budget) {
        return BudgetServiceRes.builder()
                .budgetId(budget.getId())
                .year(budget.getYear())
                .month(budget.getMonth())
                .amount(budget.getAmount())
                .build();
    }

    public static BudgetServiceRes fromDomain(Budget budget, Category category) {
        return BudgetServiceRes.builder()
                .budgetId(budget.getId())
                .year(budget.getYear())
                .month(budget.getMonth())
                .amount(budget.getAmount())
                .categoryCode(category.getCategoryCode())
                .categoryName(category.getCategoryName())
                .categoryType(category.getCategoryType())
                .build();
    }
}
