package com.moneyminder.domain.category.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DefaultCategory {
    // Income Category
    SALARY(CategoryType.INCOME, "급여"),
    INVESTMENT(CategoryType.INCOME, "투자 수익"),
    GIFT(CategoryType.INCOME, "선물"),
    BONUS(CategoryType.INCOME, "보너스"),
    OTHER_INCOME(CategoryType.INCOME, "기타"),

    // Expense Category
    FOOD(CategoryType.EXPENSE, "식비"),
    TRANSPORT(CategoryType.EXPENSE, "교통비"),
    HOUSING(CategoryType.EXPENSE, "주거비"),
    COMMUNICATION(CategoryType.EXPENSE, "통신비"),
    LIVING_SUPPLIES(CategoryType.EXPENSE, "생활용품"),
    EVENTS(CategoryType.EXPENSE, "경조사비"),
    EDUCATION_CULTURE(CategoryType.EXPENSE, "지식/문화"),
    CLOTHING_BEAUTY(CategoryType.EXPENSE, "의복/미용"),
    MEDICAL_HEALTH(CategoryType.EXPENSE, "의료/건강"),
    LEISURE_ENTERTAINMENT(CategoryType.EXPENSE, "여가/유흥"),
    TAX_INTEREST(CategoryType.EXPENSE, "세금/이자"),
    OTHER_EXPENSE(CategoryType.EXPENSE, "기타비용");

    private final CategoryType categoryType;
    private final String description;

}
