package com.moneyminder.domain.budget.presentation.dto;

import com.moneyminder.domain.budget.application.dto.request.BudgetServiceUpdateReq;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigInteger;

@Builder
public record BudgetUpdateReq(

        @NotNull
        Long budgetId,

        @NotNull
        BigInteger amount
) {

    public BudgetServiceUpdateReq toService(String userEmail) {
        return BudgetServiceUpdateReq.builder()
                .budgetId(budgetId)
                .amount(amount)
                .userEmail(userEmail)
                .build();
    }
}
