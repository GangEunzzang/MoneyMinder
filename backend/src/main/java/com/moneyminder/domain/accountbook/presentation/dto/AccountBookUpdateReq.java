package com.moneyminder.domain.accountbook.presentation.dto;

import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceUpdateReq;
import jakarta.validation.constraints.NotNull;
import java.math.BigInteger;
import java.time.LocalDate;
import lombok.Builder;

@Builder
public record AccountBookUpdateReq(

        @NotNull
        Long accountId,

        @NotNull
        BigInteger amount,

        @NotNull
        String categoryCode,

        @NotNull
        LocalDate transactionDate,

        @NotNull
        String memo,

        Long paymentMethodId,

        String merchant

) {

    public AccountBookServiceUpdateReq toService(String email) {
        return AccountBookServiceUpdateReq.builder()
                .accountId(accountId)
                .amount(amount)
                .categoryCode(categoryCode)
                .transactionDate(transactionDate)
                .memo(memo)
                .paymentMethodId(paymentMethodId)
                .merchant(merchant)
                .userEmail(email)
                .build();
    }

}
