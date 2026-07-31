package com.moneyminder.domain.paymentmethod.presentation.dto;

import com.moneyminder.domain.paymentmethod.application.dto.request.PaymentMethodServiceCreateReq;
import com.moneyminder.domain.paymentmethod.domain.type.PaymentKind;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record PaymentMethodCreateReq(

        @NotBlank
        String name,

        @NotNull
        PaymentKind kind,

        String color,

        @Min(1)
        @Max(31)
        Integer billingDay
) {

    public PaymentMethodServiceCreateReq toService(String email) {
        return PaymentMethodServiceCreateReq.builder()
                .userEmail(email)
                .name(name)
                .kind(kind)
                .color(color)
                .billingDay(billingDay)
                .build();
    }
}
