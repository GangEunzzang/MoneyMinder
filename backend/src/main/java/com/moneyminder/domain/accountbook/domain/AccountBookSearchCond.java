package com.moneyminder.domain.accountbook.domain;

import java.time.LocalDate;
import lombok.Builder;

@Builder
public record AccountBookSearchCond(
        String categoryCode,
        LocalDate startDate,
        LocalDate endDate,
        String memo,
        Long cursorId
) {
}
