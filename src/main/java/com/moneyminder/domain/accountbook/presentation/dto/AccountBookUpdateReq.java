package com.moneyminder.domain.accountbook.presentation.dto;

import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceUpdateReq;
import jakarta.validation.constraints.NotNull;
import java.math.BigInteger;

public record AccountBookUpdateReq(

        @NotNull
        Long accountId,

        @NotNull
        BigInteger amount,

        @NotNull
        String categoryCode,

        @NotNull
        String memo

) {

    public AccountBookServiceUpdateReq toService(String email) {
        return AccountBookServiceUpdateReq.builder()
                .accountId(accountId)
                .amount(amount)
                .categoryCode(categoryCode)
                .memo(memo)
                .userEmail(email)
                .build();
    }

}
