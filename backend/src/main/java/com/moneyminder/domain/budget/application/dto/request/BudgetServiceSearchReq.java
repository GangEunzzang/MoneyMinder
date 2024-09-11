package com.moneyminder.domain.budget.application.dto.request;

import lombok.Builder;

@Builder
public record BudgetServiceSearchReq(
        String categoryCode,
        Integer year,
        Integer month
) {

    public static BudgetServiceSearchReq from(String categoryCode, Integer year, Integer month) {
        return BudgetServiceSearchReq.builder()
                .categoryCode(categoryCode)
                .year(year)
                .month(month)
                .build();
    }
}
