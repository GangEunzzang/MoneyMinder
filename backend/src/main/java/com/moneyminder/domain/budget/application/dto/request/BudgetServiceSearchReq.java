package com.moneyminder.domain.budget.application.dto.request;

import com.moneyminder.domain.budget.domain.BudgetSearchCond;
import lombok.Builder;

@Builder
public record BudgetServiceSearchReq(
        String categoryCode,
        Integer year,
        Integer month
) {

    public BudgetSearchCond toCond() {
        return BudgetSearchCond.builder()
                .categoryCode(categoryCode)
                .year(year)
                .month(month)
                .build();
    }

    public static BudgetServiceSearchReq from(String categoryCode, Integer year, Integer month) {
        return BudgetServiceSearchReq.builder()
                .categoryCode(categoryCode)
                .year(year)
                .month(month)
                .build();
    }
}
