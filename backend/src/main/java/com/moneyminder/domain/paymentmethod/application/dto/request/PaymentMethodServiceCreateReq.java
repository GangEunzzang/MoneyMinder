package com.moneyminder.domain.paymentmethod.application.dto.request;

import com.moneyminder.domain.paymentmethod.domain.PaymentMethod;
import com.moneyminder.domain.paymentmethod.domain.type.PaymentKind;
import lombok.Builder;

@Builder
public record PaymentMethodServiceCreateReq(
        String userEmail,
        String name,
        PaymentKind kind,
        String color,
        Integer billingDay
) {

    public PaymentMethod toDomain(int sortOrder) {
        return PaymentMethod.create(userEmail, name, kind, color, billingDay, sortOrder);
    }
}
