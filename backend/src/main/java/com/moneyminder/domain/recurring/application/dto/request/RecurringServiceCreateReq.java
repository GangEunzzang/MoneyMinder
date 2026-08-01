package com.moneyminder.domain.recurring.application.dto.request;

import com.moneyminder.domain.recurring.domain.Recurring;
import java.math.BigInteger;
import lombok.Builder;

@Builder
public record RecurringServiceCreateReq(
        String userEmail,
        String name,
        BigInteger amount,
        int cycleDay,
        String categoryCode,
        Long paymentMethodId,
        boolean autoRecord,
        int remindBeforeDays
) {

    public Recurring toDomain() {
        return Recurring.create(userEmail, name, amount, cycleDay, categoryCode, paymentMethodId, autoRecord,
                remindBeforeDays);
    }
}
