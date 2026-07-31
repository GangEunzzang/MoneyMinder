package com.moneyminder.domain.paymentmethod.application.dto.request;

import com.moneyminder.domain.paymentmethod.domain.type.PaymentKind;
import lombok.Builder;

@Builder
public record PaymentMethodServiceUpdateReq(
        Long paymentMethodId,
        String userEmail,
        String name,
        PaymentKind kind,
        String color,
        Integer billingDay
) {
}
