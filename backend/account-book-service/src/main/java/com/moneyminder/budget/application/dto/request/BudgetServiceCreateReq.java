package com.moneyminder.budget.application.dto.request;

import lombok.Builder;

import java.math.BigInteger;

@Builder
public record BudgetServiceCreateReq(
        Integer year,
        Integer month,
        String userEmail,
        BigInteger amount,
        String categoryCode
) {
}
