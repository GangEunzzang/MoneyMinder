package com.moneyminder.domain.recurring.application.dto.response;

import com.moneyminder.domain.recurring.domain.Recurring;
import java.math.BigInteger;
import java.time.LocalDate;
import lombok.Builder;

@Builder
public record RecurringServiceRes(
        Long recurringId,
        String name,
        BigInteger amount,
        int cycleDay,
        String categoryCode,
        Long paymentMethodId,
        boolean autoRecord,
        int remindBeforeDays,
        LocalDate nextBillingDate,
        long daysUntilBilling,
        boolean settledThisMonth
) {

    public static RecurringServiceRes fromDomain(Recurring recurring, LocalDate today) {
        return RecurringServiceRes.builder()
                .recurringId(recurring.getId())
                .name(recurring.getName())
                .amount(recurring.getAmount())
                .cycleDay(recurring.getCycleDay())
                .categoryCode(recurring.getCategoryCode())
                .paymentMethodId(recurring.getPaymentMethodId())
                .autoRecord(recurring.isAutoRecord())
                .remindBeforeDays(recurring.getRemindBeforeDays())
                .nextBillingDate(recurring.nextBillingDate(today))
                .daysUntilBilling(recurring.daysUntilBilling(today))
                .settledThisMonth(recurring.isSettledThisMonth(today))
                .build();
    }
}
