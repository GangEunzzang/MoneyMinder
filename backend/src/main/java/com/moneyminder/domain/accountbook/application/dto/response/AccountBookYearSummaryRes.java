package com.moneyminder.domain.accountbook.application.dto.response;

import lombok.Builder;

import java.math.BigInteger;
import java.util.Map;

@Builder
public record AccountBookYearSummaryRes(
        Integer year,
        BigInteger yearTotalIncome,
        BigInteger yearTotalExpense,
        Map<Integer, MonthSummary> monthlyTotal

) {

    @Builder
    public record MonthSummary(
            BigInteger monthTotalIncome,
            BigInteger monthTotalExpense
    ) {

        public static MonthSummary from(BigInteger monthTotalIncome, BigInteger monthTotalExpense) {
            return new MonthSummary(monthTotalIncome, monthTotalExpense);
        }

    }
}
