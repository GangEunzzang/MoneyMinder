package com.moneyminder.accountbook.application.dto.request;

import com.moneyminder.domain.accountbook.domain.AccountBook;
import lombok.Builder;

import java.math.BigInteger;
import java.time.LocalDate;

@Builder
public record AccountBookServiceUpdateReq(

        Long accountId,

        BigInteger amount,

        String categoryCode,

        LocalDate transactionDate,

        String memo,

        String userEmail
) {


    public AccountBook toDomain() {
        return AccountBook.builder()
                .accountId(accountId)
                .categoryCode(categoryCode)
                .userEmail(userEmail)
                .amount(amount)
                .transactionDate(transactionDate)
                .memo(memo)
                .build();
    }
}
