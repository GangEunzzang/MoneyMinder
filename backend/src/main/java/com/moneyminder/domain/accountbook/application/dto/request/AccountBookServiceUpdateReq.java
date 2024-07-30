package com.moneyminder.domain.accountbook.application.dto.request;

import com.moneyminder.domain.accountbook.domain.AccountBook;
import java.math.BigInteger;
import java.time.LocalDate;
import lombok.Builder;

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