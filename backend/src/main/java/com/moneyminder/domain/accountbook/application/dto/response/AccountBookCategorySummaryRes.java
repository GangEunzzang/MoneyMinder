package com.moneyminder.domain.accountbook.application.dto.response;

import java.math.BigInteger;
import lombok.Builder;

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
