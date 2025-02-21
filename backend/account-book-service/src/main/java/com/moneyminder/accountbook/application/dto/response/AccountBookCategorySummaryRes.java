package com.moneyminder.accountbook.application.dto.response;

import lombok.Builder;

import java.math.BigInteger;

@Builder
public record AccountBookCategorySummaryRes(
        String categoryName,
        String categoryCode,
        BigInteger totalSpentAmount
) {

    public static AccountBookCategorySummaryRes from(String categoryName, String categoryCode,
            BigInteger totalSpentAmount) {
        return AccountBookCategorySummaryRes.builder()
                .categoryName(categoryName)
                .categoryCode(categoryCode)
                .totalSpentAmount(totalSpentAmount)
                .build();
    }

}
