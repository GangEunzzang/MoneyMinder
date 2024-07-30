package com.moneyminder.domain.accountbook.presentation.dto;

import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceCreateReq;
import jakarta.validation.constraints.NotNull;
import java.math.BigInteger;
import java.time.LocalDate;
import lombok.Builder;

@Builder
public record AccountBookCreateReq(

        @NotNull
        BigInteger amount,

        @NotNull
        String categoryCode,

        @NotNull
        LocalDate transactionDate,

        String memo
) {

    public AccountBookServiceCreateReq toService(String email) {
        return AccountBookServiceCreateReq.builder()
                .amount(amount)
                .categoryCode(categoryCode)
                .transactionDate(transactionDate)
                .memo(memo)
                .userEmail(email)
                .build();
    }

}