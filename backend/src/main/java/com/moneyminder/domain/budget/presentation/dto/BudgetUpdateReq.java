package com.moneyminder.domain.budget.presentation.dto;

import com.moneyminder.domain.budget.application.dto.request.BudgetServiceUpdateReq;
import jakarta.validation.constraints.NotNull;
import java.math.BigInteger;
import lombok.Builder;

@Builder
public record BudgetUpdateReq(

        @NotNull
        BigInteger amount
) {

    public BudgetServiceUpdateReq toService(Long budgetId, String userEmail) {
        return BudgetServiceUpdateReq.builder()
                .budgetId(budgetId)
                .amount(amount)
                .userEmail(userEmail)
                .build();
    }
}
