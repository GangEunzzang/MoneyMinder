package com.moneyminder.domain.accountbook.application.dto.request;

import com.moneyminder.domain.accountbook.domain.AccountBookSearchCond;
import java.time.LocalDate;
import lombok.Builder;

@Builder
public record AccountBookServiceSearchReq(
        String categoryCode,
        LocalDate startDate,
        LocalDate endDate,
        String memo,
        Long cursorId
){

    public AccountBookSearchCond toCond() {
        return AccountBookSearchCond.builder()
                .categoryCode(categoryCode)
                .startDate(startDate)
                .endDate(endDate)
                .memo(memo)
                .cursorId(cursorId)
                .build();
    }

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
