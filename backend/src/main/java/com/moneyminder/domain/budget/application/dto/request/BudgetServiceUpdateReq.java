package com.moneyminder.domain.budget.application.dto.request;

import java.math.BigInteger;
import lombok.Builder;

@Builder
public record BudgetServiceUpdateReq(
        Long budgetId,
        String userEmail,
        BigInteger amount
) {

}
