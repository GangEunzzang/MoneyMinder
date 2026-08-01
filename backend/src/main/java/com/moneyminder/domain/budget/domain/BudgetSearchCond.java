package com.moneyminder.domain.budget.domain;

import lombok.Builder;

@Builder
public record BudgetSearchCond(
        String categoryCode,
        Integer year,
        Integer month
) {
}
