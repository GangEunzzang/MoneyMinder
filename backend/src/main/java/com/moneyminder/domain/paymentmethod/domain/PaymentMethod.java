package com.moneyminder.domain.paymentmethod.domain;

import com.moneyminder.domain.paymentmethod.domain.type.PaymentKind;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import lombok.Builder;
import lombok.Getter;
import org.springframework.util.Assert;

@Getter
public class PaymentMethod {

    private final Long id;
    private final String userEmail;
    private String name;
    private PaymentKind kind;
    private String color;
    private Integer billingDay;
    private int sortOrder;

    @Builder
    private PaymentMethod(Long id, String userEmail, String name, PaymentKind kind, String color, Integer billingDay,
            int sortOrder) {
        Assert.hasText(userEmail, "userEmail must not be empty");
        Assert.hasText(name, "name must not be empty");
        Assert.notNull(kind, "kind must not be null");

        this.id = id;
        this.userEmail = userEmail;
        this.name = name;
        this.kind = kind;
        this.color = color;
        this.billingDay = validateBillingDay(kind, billingDay);
        this.sortOrder = sortOrder;
    }

    public static PaymentMethod create(String userEmail, String name, PaymentKind kind, String color,
            Integer billingDay, int sortOrder) {
        return PaymentMethod.builder()
                .userEmail(userEmail)
                .name(name)
                .kind(kind)
                .color(color)
                .billingDay(billingDay)
                .sortOrder(sortOrder)
                .build();
    }

    public void update(String name, PaymentKind kind, String color, Integer billingDay) {
        Assert.hasText(name, "name must not be empty");
        Assert.notNull(kind, "kind must not be null");

        this.name = name;
        this.kind = kind;
        this.color = color;
        this.billingDay = validateBillingDay(kind, billingDay);
    }

    public void changeSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public boolean isOwnedBy(String email) {
        return userEmail.equals(email);
    }

    public void validateOwner(String email) {
        if (!isOwnedBy(email)) {
            throw new BaseException(ResultCode.PAYMENT_METHOD_FORBIDDEN);
        }
    }

    /**
     * "이번 달 카드 사용액" 은 카드로 낸 것만 센다. 현금·계좌는 빠진다.
     */
    public boolean isCard() {
        return PaymentKind.CARD.equals(kind);
    }

    /**
     * 결제일이 있는 신용카드만 다음 결제일을 갖는다. 체크카드는 즉시 출금이라 없다.
     */
    public boolean hasBillingDay() {
        return billingDay != null;
    }

    /**
     * 결제일은 신용카드에만 있다. 현금에 결제일을 붙이면 다음 결제일 계산이 말이 되지 않는다.
     */
    private Integer validateBillingDay(PaymentKind kind, Integer billingDay) {
        if (billingDay == null) {
            return null;
        }

        if (!PaymentKind.CARD.equals(kind)) {
            throw new BaseException(ResultCode.PAYMENT_METHOD_BILLING_DAY_NOT_ALLOWED);
        }

        if (billingDay < 1 || billingDay > 31) {
            throw new BaseException(ResultCode.PAYMENT_METHOD_INVALID_BILLING_DAY);
        }

        return billingDay;
    }
}
