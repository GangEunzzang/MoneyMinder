package com.moneyminder.domain.budget.application.dto.request;

import lombok.Builder;

import java.math.BigInteger;

@Builder
public record BudgetServiceUpdateReq(
        Long budgetId,
        String userEmail,
        BigInteger amount
) {

}
