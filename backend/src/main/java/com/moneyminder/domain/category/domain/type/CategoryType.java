package com.moneyminder.domain.category.domain.type;

import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CategoryType {

    INCOME("수입", "001"),
    EXPENSE("지출", "002"),
    ETC("기타", "999");

    private final String description;
    private final String dbCode;

    public static CategoryType fromDbCode(String dbCode) {
        return Arrays.stream(CategoryType.values())
                .filter(categoryType -> categoryType.getDbCode().equals(dbCode))
                .findFirst()
                .orElse(ETC);
    }

    public static CategoryType fromValue(String value) {
        return Arrays.stream(CategoryType.values())
                .filter(categoryType -> categoryType.name().equalsIgnoreCase(value))
                .findFirst()
                .orElse(ETC);
    }

}
