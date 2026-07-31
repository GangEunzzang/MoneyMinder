package com.moneyminder.domain.budget.domain;

import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import java.math.BigInteger;
import lombok.Builder;
import lombok.Getter;
import org.springframework.util.Assert;

@Getter
public class Budget {

    private final Long id;
    private final Integer year;
    private final Integer month;
    private final String userEmail;
    private final String categoryCode;
    private BigInteger amount;

    @Builder
    private Budget(Long id, Integer year, Integer month, BigInteger amount, String userEmail, String categoryCode) {
        Assert.isTrue(year != null && year.toString().length() == 4, "year must be 4 digits");
        Assert.isTrue(month != null && month >= 1 && month <= 12, "month must be between 1 and 12");
        Assert.notNull(amount, "amount must not be null");
        Assert.notNull(userEmail, "userEmail must not be null");
        Assert.notNull(categoryCode, "categoryCode must not be null");

        this.id = id;
        this.year = year;
        this.month = month;
        this.amount = amount;
        this.userEmail = userEmail;
        this.categoryCode = categoryCode;
    }

    public void changeAmount(BigInteger amount) {
        Assert.notNull(amount, "amount must not be null");

        this.amount = amount;
    }

    public boolean isOwnedBy(String email) {
        return userEmail.equals(email);
    }

    public void validateOwner(String email) {
        if (!isOwnedBy(email)) {
            throw new BaseException(ResultCode.BUDGET_FORBIDDEN);
        }
    }

    public boolean isFor(Integer year, Integer month) {
        return this.year.equals(year) && this.month.equals(month);
    }

    /**
     * 이 예산으로 쓴 금액이 한도를 넘었는지. 넘은 만큼이 아니라 넘었는지만 답한다.
     */
    public boolean isExceededBy(BigInteger spentAmount) {
        return spentAmount.compareTo(amount) > 0;
    }

    public BigInteger remainingFrom(BigInteger spentAmount) {
        return amount.subtract(spentAmount);
    }
}
