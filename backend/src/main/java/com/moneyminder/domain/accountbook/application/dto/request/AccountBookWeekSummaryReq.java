package com.moneyminder.domain.accountbook.application.dto.request;

import com.moneyminder.domain.category.domain.type.CategoryType;
import java.time.LocalDate;

public record AccountBookWeekSummaryReq(
        LocalDate startDate,
        LocalDate endDate,
        CategoryType categoryType
) {

    public static AccountBookWeekSummaryReq from(LocalDate startDate, LocalDate endDate, CategoryType categoryType) {
        return new AccountBookWeekSummaryReq(startDate, endDate, categoryType);
    }
}
