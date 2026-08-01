package com.moneyminder.domain.budget.domain;

import com.moneyminder.domain.category.domain.type.CategoryType;
import java.math.BigInteger;

public record BudgetWithCategory(
        Long budgetId,
        Integer year,
        Integer month,
        BigInteger amount,
        String categoryCode,
        String categoryName,
        CategoryType categoryType
) {
}
