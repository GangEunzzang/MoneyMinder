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
    private final boolean autoRecorded;
    private String categoryCode;
    private BigInteger amount;
    private LocalDate transactionDate;
    private String memo;
    private Long paymentMethodId;
    private String merchant;

    @Builder
    private AccountBook(Long accountId, String categoryCode, String userEmail, BigInteger amount,
            LocalDate transactionDate, String memo, Long paymentMethodId, String merchant, boolean autoRecorded) {
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
        this.paymentMethodId = paymentMethodId;
        this.merchant = merchant;
        this.autoRecorded = autoRecorded;
    }

    public void update(String categoryCode, BigInteger amount, LocalDate transactionDate, String memo,
            Long paymentMethodId, String merchant) {
        Assert.notNull(categoryCode, "categoryCode must not be null");
        Assert.notNull(amount, "amount must not be null");
        Assert.notNull(transactionDate, "transactionDate must not be null");

        this.categoryCode = categoryCode;
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.memo = memo;
        this.paymentMethodId = paymentMethodId;
        this.merchant = merchant;
    }

    /**
     * 고정지출이 자동으로 만든 거래. 내역에서 "자동기록"으로 구분해 보여준다.
     */
    public static AccountBook autoRecordOf(String userEmail, String categoryCode, BigInteger amount,
            LocalDate transactionDate, String merchant, Long paymentMethodId) {
        return AccountBook.builder()
                .userEmail(userEmail)
                .categoryCode(categoryCode)
                .amount(amount)
                .transactionDate(transactionDate)
                .merchant(merchant)
                .paymentMethodId(paymentMethodId)
                .autoRecorded(true)
                .build();
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
