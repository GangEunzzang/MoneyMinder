package com.moneyminder.domain.recurring.domain;

import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import lombok.Builder;
import lombok.Getter;
import org.springframework.util.Assert;

@Getter
public class Recurring {

    private static final int MAX_REMIND_BEFORE_DAYS = 14;

    private final Long id;
    private final String userEmail;
    private String name;
    private BigInteger amount;
    private int cycleDay;
    private String categoryCode;
    private Long paymentMethodId;
    private boolean autoRecord;
    private int remindBeforeDays;
    private YearMonth lastRecordedMonth;

    @Builder
    private Recurring(Long id, String userEmail, String name, BigInteger amount, int cycleDay, String categoryCode,
            Long paymentMethodId, boolean autoRecord, int remindBeforeDays, YearMonth lastRecordedMonth) {
        Assert.hasText(userEmail, "userEmail must not be empty");
        Assert.hasText(name, "name must not be empty");
        Assert.notNull(amount, "amount must not be null");
        Assert.hasText(categoryCode, "categoryCode must not be empty");

        this.id = id;
        this.userEmail = userEmail;
        this.name = name;
        this.amount = amount;
        this.cycleDay = validateCycleDay(cycleDay);
        this.categoryCode = categoryCode;
        this.paymentMethodId = paymentMethodId;
        this.autoRecord = autoRecord;
        this.remindBeforeDays = validateRemindBeforeDays(remindBeforeDays);
        this.lastRecordedMonth = lastRecordedMonth;
    }

    public static Recurring create(String userEmail, String name, BigInteger amount, int cycleDay, String categoryCode,
            Long paymentMethodId, boolean autoRecord, int remindBeforeDays) {
        return Recurring.builder()
                .userEmail(userEmail)
                .name(name)
                .amount(amount)
                .cycleDay(cycleDay)
                .categoryCode(categoryCode)
                .paymentMethodId(paymentMethodId)
                .autoRecord(autoRecord)
                .remindBeforeDays(remindBeforeDays)
                .build();
    }

    public void update(String name, BigInteger amount, int cycleDay, String categoryCode, Long paymentMethodId,
            boolean autoRecord, int remindBeforeDays) {
        Assert.hasText(name, "name must not be empty");
        Assert.notNull(amount, "amount must not be null");
        Assert.hasText(categoryCode, "categoryCode must not be empty");

        this.name = name;
        this.amount = amount;
        this.cycleDay = validateCycleDay(cycleDay);
        this.categoryCode = categoryCode;
        this.paymentMethodId = paymentMethodId;
        this.autoRecord = autoRecord;
        this.remindBeforeDays = validateRemindBeforeDays(remindBeforeDays);
    }

    public boolean isOwnedBy(String email) {
        return userEmail.equals(email);
    }

    public void validateOwner(String email) {
        if (!isOwnedBy(email)) {
            throw new BaseException(ResultCode.RECURRING_FORBIDDEN);
        }
    }

    /**
     * 31일로 걸어둔 항목은 2월에 결제일이 없다. 그런 달은 말일로 당긴다.
     */
    public LocalDate billingDateOf(YearMonth yearMonth) {
        return yearMonth.atDay(Math.min(cycleDay, yearMonth.lengthOfMonth()));
    }

    public LocalDate nextBillingDate(LocalDate today) {
        LocalDate thisMonth = billingDateOf(YearMonth.from(today));

        return thisMonth.isBefore(today) ? billingDateOf(YearMonth.from(today).plusMonths(1)) : thisMonth;
    }

    public long daysUntilBilling(LocalDate today) {
        return ChronoUnit.DAYS.between(today, nextBillingDate(today));
    }

    /**
     * 이번 달 결제가 이미 지났는지. 목록을 "곧 결제 / 이번 달 완료" 로 가르는 기준이다.
     */
    public boolean isSettledThisMonth(LocalDate today) {
        return billingDateOf(YearMonth.from(today)).isBefore(today);
    }

    /**
     * 자동기록 대상인지. lastRecordedMonth 로 멱등성을 지킨다 —
     * 배치가 하루에 열 번 돌아도 한 달에 한 번만 기록된다.
     */
    public boolean shouldAutoRecord(LocalDate today) {
        if (!autoRecord) {
            return false;
        }

        YearMonth thisMonth = YearMonth.from(today);
        if (thisMonth.equals(lastRecordedMonth)) {
            return false;
        }

        return !billingDateOf(thisMonth).isAfter(today);
    }

    public boolean dueForReminder(LocalDate today) {
        if (remindBeforeDays == 0) {
            return false;
        }

        long left = daysUntilBilling(today);

        return left > 0 && left <= remindBeforeDays;
    }

    public void markRecorded(YearMonth yearMonth) {
        this.lastRecordedMonth = yearMonth;
    }

    private int validateCycleDay(int cycleDay) {
        if (cycleDay < 1 || cycleDay > 31) {
            throw new BaseException(ResultCode.RECURRING_INVALID_CYCLE_DAY);
        }

        return cycleDay;
    }

    private int validateRemindBeforeDays(int remindBeforeDays) {
        if (remindBeforeDays < 0 || remindBeforeDays > MAX_REMIND_BEFORE_DAYS) {
            throw new BaseException(ResultCode.RECURRING_INVALID_REMIND_DAYS);
        }

        return remindBeforeDays;
    }
}
