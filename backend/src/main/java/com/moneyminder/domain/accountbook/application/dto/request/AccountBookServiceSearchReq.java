package com.moneyminder.domain.accountbook.application.dto.request;

import java.time.LocalDate;
import lombok.Builder;

@Builder
public record AccountBookServiceSearchReq(
        String categoryCode,
        LocalDate startDate,
        LocalDate endDate,
        String memo
){

    public static AccountBookServiceSearchReq from(String categoryCode, LocalDate startDate, LocalDate endDate, String memo) {
        return AccountBookServiceSearchReq.builder()
                .categoryCode(categoryCode)
                .startDate(startDate)
                .endDate(endDate)
                .memo(memo)
                .build();
    }
}
