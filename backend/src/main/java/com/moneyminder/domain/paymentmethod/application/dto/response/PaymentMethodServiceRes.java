package com.moneyminder.domain.paymentmethod.application.dto.response;

import com.moneyminder.domain.paymentmethod.domain.PaymentMethod;
import com.moneyminder.domain.paymentmethod.domain.type.PaymentKind;
import lombok.Builder;

@Builder
public record PaymentMethodServiceRes(
        Long paymentMethodId,
        String name,
        PaymentKind kind,
        String color,
        Integer billingDay,
        int sortOrder
) {

    public static PaymentMethodServiceRes fromDomain(PaymentMethod paymentMethod) {
        return PaymentMethodServiceRes.builder()
                .paymentMethodId(paymentMethod.getId())
                .name(paymentMethod.getName())
                .kind(paymentMethod.getKind())
                .color(paymentMethod.getColor())
                .billingDay(paymentMethod.getBillingDay())
                .sortOrder(paymentMethod.getSortOrder())
                .build();
    }
}
