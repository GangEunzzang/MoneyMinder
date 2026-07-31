package com.moneyminder.domain.budget.application.dto.request;

import com.moneyminder.domain.budget.domain.Budget;
import java.math.BigInteger;
import lombok.Builder;

@Builder
public record BudgetServiceCreateReq(
        Integer year,
        Integer month,
        String userEmail,
        BigInteger amount,
        String categoryCode
) {

    public Budget toDomain() {
        return Budget.builder()
                .year(year)
                .month(month)
                .userEmail(userEmail)
                .amount(amount)
                .categoryCode(categoryCode)
                .build();
    }
}
