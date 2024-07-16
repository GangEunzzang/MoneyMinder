package com.moneyminder.domain.category.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CategoryType {

    INCOME("수입"),
    EXPENSE("지출");

    private final String description;

}
