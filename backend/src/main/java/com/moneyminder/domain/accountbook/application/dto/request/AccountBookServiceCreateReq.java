package com.moneyminder.domain.accountbook.application.dto.request;

import com.moneyminder.domain.accountbook.domain.AccountBook;
import java.math.BigInteger;
import java.time.LocalDate;
import lombok.Builder;

@Builder
public record AccountBookServiceCreateReq(

        BigInteger amount,

        String categoryCode,

        String memo,

        LocalDate transactionDate,

        String userEmail
) {

    public AccountBook toDomain() {
        return AccountBook.builder()
                .categoryCode(categoryCode)
                .userEmail(userEmail)
                .amount(amount)
                .transactionDate(transactionDate)
                .memo(memo)
                .build();

    }

}