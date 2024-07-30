package com.moneyminder.domain.accountbook.domain;

import com.moneyminder.domain.accountbook.infrastructure.jpa.entity.AccountBookEntity;
import java.math.BigInteger;
import java.time.LocalDate;
import lombok.Builder;
import org.springframework.util.Assert;

public record AccountBook(
        Long accountId,
        String categoryCode,
        String userEmail,
        BigInteger amount,
        LocalDate transactionDate,
        String memo
) {

    @Builder
    public AccountBook {
        Assert.notNull(categoryCode, "categoryCode must not be null");
        Assert.notNull(userEmail, "userEmail must not be null");
        Assert.notNull(amount, "amount must not be null");
        Assert.notNull(transactionDate, "transactionDate must not be null");
    }

    public AccountBook update(AccountBook update) {
        return AccountBook.builder()
                .accountId(accountId)
                .userEmail(userEmail)
                .amount(update.amount())
                .categoryCode(update.categoryCode())
                .transactionDate(update.transactionDate())
                .memo(update.memo())
                .build();
    }

    public AccountBookEntity toEntity() {
        return AccountBookEntity.builder()
                .id(accountId)
                .categoryCode(categoryCode)
                .userEmail(userEmail)
                .amount(amount)
                .transactionDate(transactionDate)
                .memo(memo)
                .build();
    }



}