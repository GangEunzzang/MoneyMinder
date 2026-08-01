package com.moneyminder.domain.recurring.presentation.dto;

import com.moneyminder.domain.recurring.application.dto.request.RecurringServiceUpdateReq;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigInteger;
import lombok.Builder;

@Builder
public record RecurringUpdateReq(

        @NotBlank
        String name,

        @NotNull
        BigInteger amount,

        @Min(1)
        @Max(31)
        int cycleDay,

        @NotBlank
        String categoryCode,

        Long paymentMethodId,

        boolean autoRecord,

        @Min(0)
        @Max(14)
        int remindBeforeDays
) {

    public RecurringServiceUpdateReq toService(Long recurringId, String email) {
        return RecurringServiceUpdateReq.builder()
                .recurringId(recurringId)
                .userEmail(email)
                .name(name)
                .amount(amount)
                .cycleDay(cycleDay)
                .categoryCode(categoryCode)
                .paymentMethodId(paymentMethodId)
                .autoRecord(autoRecord)
                .remindBeforeDays(remindBeforeDays)
                .build();
    }
}
