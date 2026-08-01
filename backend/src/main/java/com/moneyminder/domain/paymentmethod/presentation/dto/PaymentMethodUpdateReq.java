package com.moneyminder.domain.paymentmethod.presentation.dto;

import com.moneyminder.domain.paymentmethod.application.dto.request.PaymentMethodServiceUpdateReq;
import com.moneyminder.domain.paymentmethod.domain.type.PaymentKind;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record PaymentMethodUpdateReq(

        @NotBlank
        String name,

        @NotNull
        PaymentKind kind,

        String color,

        @Min(1)
        @Max(31)
        Integer billingDay
) {

    public PaymentMethodServiceUpdateReq toService(Long paymentMethodId, String email) {
        return PaymentMethodServiceUpdateReq.builder()
                .paymentMethodId(paymentMethodId)
                .userEmail(email)
                .name(name)
                .kind(kind)
                .color(color)
                .billingDay(billingDay)
                .build();
    }
}
