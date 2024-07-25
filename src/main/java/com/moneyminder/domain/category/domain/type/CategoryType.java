package com.moneyminder.domain.category.domain.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum CategoryType {

    INCOME("수입", "001"),
    EXPENSE("지출", "002");

    private final String description;
    private final String dbCode;

    public static CategoryType fromDbCode(String dbCode) {
       return Arrays.stream(CategoryType.values())
                .filter(categoryType -> categoryType.getDbCode().equals(dbCode))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown dbCode: " + dbCode));
    }

    public static CategoryType fromValue(String value) {
        return Arrays.stream(CategoryType.values())
                .filter(categoryType -> categoryType.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown value: " + value));
    }

}
