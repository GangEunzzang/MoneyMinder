package com.moneyminder.domain.accountbook.application.dto.request;

import com.moneyminder.domain.category.domain.type.CategoryType;
import lombok.Builder;

@Builder
public record AccountBookMonthSummaryReq(

        Integer year,
        Integer month,
        CategoryType categoryType
) {


    public static AccountBookMonthSummaryReq from(Integer year, Integer month, CategoryType categoryType) {
        return AccountBookMonthSummaryReq.builder()
                .year(year)
                .month(month)
                .categoryType(categoryType)
                .build();
    }
}
