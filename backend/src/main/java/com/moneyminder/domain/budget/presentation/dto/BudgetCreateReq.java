package com.moneyminder.domain.budget.presentation.dto;

import com.moneyminder.domain.budget.application.dto.request.BudgetServiceCreateReq;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

import java.math.BigInteger;

@Builder
public record BudgetCreateReq(

        @NotNull
        BigInteger amount,

        @NotNull
        @Pattern(regexp = "\\d{4}", message = "Year must be a 4-digit number")
        String year,

        @NotNull
        @Min(value = 1, message = "Month must be at least 1")
        @Max(value = 12, message = "Month must be at most 12")
        String month,

        @NotNull
        String categoryCode
) {

    public BudgetServiceCreateReq toService(String email) {
        return BudgetServiceCreateReq.builder()
                .amount(amount)
                .year(Integer.valueOf(year))
                .month(Integer.valueOf(month))
                .userEmail(email)
                .categoryCode(categoryCode)
                .build();
    }
}
