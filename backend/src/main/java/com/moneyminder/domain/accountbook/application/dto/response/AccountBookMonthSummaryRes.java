package com.moneyminder.domain.accountbook.application.dto.response;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Builder;

import java.math.BigInteger;

public record AccountBookMonthSummaryRes(

        Integer year,
        Integer month,
        BigInteger monthTotalIncome,
        BigInteger monthTotalExpense
) {

    @QueryProjection
    @Builder
    public AccountBookMonthSummaryRes {
    }
}
