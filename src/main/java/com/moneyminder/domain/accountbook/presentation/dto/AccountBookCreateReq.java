package com.moneyminder.domain.accountbook.presentation.dto;

import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceCreateReq;
import jakarta.validation.constraints.NotNull;
import java.math.BigInteger;

public record AccountBookCreateReq(

        @NotNull
        BigInteger amount,

        @NotNull
        String categoryCode,

        String memo
) {

    public AccountBookServiceCreateReq toService(String email) {
        return AccountBookServiceCreateReq.builder()
                .amount(amount)
                .categoryCode(categoryCode)
                .memo(memo)
                .userEmail(email)
                .build();
    }

}