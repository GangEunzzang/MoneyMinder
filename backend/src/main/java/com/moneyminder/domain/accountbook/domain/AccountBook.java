package com.moneyminder.domain.accountbook.domain;

import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import java.math.BigInteger;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;
import org.springframework.util.Assert;

@Getter
public class AccountBook {

    private final Long accountId;
    private final String userEmail;
    private String categoryCode;
    private BigInteger amount;
    private LocalDate transactionDate;
    private String memo;

    @Builder
    private AccountBook(Long accountId, String categoryCode, String userEmail, BigInteger amount,
            LocalDate transactionDate, String memo) {
        Assert.notNull(categoryCode, "categoryCode must not be null");
        Assert.notNull(userEmail, "userEmail must not be null");
        Assert.notNull(amount, "amount must not be null");
        Assert.notNull(transactionDate, "transactionDate must not be null");

        this.accountId = accountId;
        this.categoryCode = categoryCode;
        this.userEmail = userEmail;
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.memo = memo;
    }

    public void update(String categoryCode, BigInteger amount, LocalDate transactionDate, String memo) {
        Assert.notNull(categoryCode, "categoryCode must not be null");
        Assert.notNull(amount, "amount must not be null");
        Assert.notNull(transactionDate, "transactionDate must not be null");

        this.categoryCode = categoryCode;
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.memo = memo;
    }

    public boolean isOwnedBy(String email) {
        return userEmail.equals(email);
    }

    /**
     * 남의 가계부를 건드리는 요청은 여기서 끊는다.
     */
    public void validateOwner(String email) {
        if (!isOwnedBy(email)) {
            throw new BaseException(ResultCode.ACCOUNT_BOOK_FORBIDDEN);
        }
    }

    public boolean isOn(LocalDate date) {
        return transactionDate.equals(date);
    }

    public boolean isBetween(LocalDate startDate, LocalDate endDate) {
        return !transactionDate.isBefore(startDate) && !transactionDate.isAfter(endDate);
    }
}
