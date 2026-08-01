package com.moneyminder.domain.recurring.application.dto.request;

import java.math.BigInteger;
import lombok.Builder;

@Builder
public record RecurringServiceUpdateReq(
        Long recurringId,
        String userEmail,
        String name,
        BigInteger amount,
        int cycleDay,
        String categoryCode,
        Long paymentMethodId,
        boolean autoRecord,
        int remindBeforeDays
) {
}
