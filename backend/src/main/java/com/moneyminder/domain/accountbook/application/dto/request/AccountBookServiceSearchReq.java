package com.moneyminder.domain.accountbook.application.dto.request;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record AccountBookServiceSearchReq(
        String categoryCode,
        LocalDate startDate,
        LocalDate endDate,
        String memo,
        Long cursorId
){

    public static AccountBookServiceSearchReq from(String categoryCode, LocalDate startDate, LocalDate endDate, String memo, Long cursorId) {
        return AccountBookServiceSearchReq.builder()
                .categoryCode(categoryCode)
                .startDate(startDate)
                .endDate(endDate)
                .memo(memo)
                .cursorId(cursorId)
                .build();
    }
}
