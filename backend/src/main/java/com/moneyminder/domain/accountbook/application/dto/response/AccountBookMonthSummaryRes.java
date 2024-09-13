package com.moneyminder.domain.accountbook.application.dto.response;

import com.querydsl.core.annotations.QueryProjection;
import java.math.BigInteger;
import java.util.Map;
import lombok.Builder;

public record AccountBookMonthSummaryRes(

        Integer year,
        Integer month,
        BigInteger monthTotalIncome,
        BigInteger monthTotalExpense,
        Map<Integer, WeekSummary> weeklySummary
) {

    public record WeekSummary(
            BigInteger weekTotalIncome,
            BigInteger weekTotalExpense
    ) {

        public static WeekSummary from(BigInteger weekTotalIncome, BigInteger weekTotalExpense) {
            return new WeekSummary(weekTotalIncome, weekTotalExpense);
        }
    }

    @QueryProjection
    @Builder
    public AccountBookMonthSummaryRes {
    }
}
