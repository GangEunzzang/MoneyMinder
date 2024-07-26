package com.moneyminder.domain.category.domain.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DefaultCategory {

    // Income Category
    SALARY(CategoryType.INCOME, "급여", "DC001"),
    INVESTMENT(CategoryType.INCOME, "투자 수익", "DC002"),
    GIFT(CategoryType.INCOME, "선물", "DC003"),
    BONUS(CategoryType.INCOME, "보너스", "DC004"),
    OTHER_INCOME(CategoryType.INCOME, "기타", "DC005"),

    // Expense Category
    FOOD(CategoryType.EXPENSE, "식비", "DC006"),
    TRANSPORT(CategoryType.EXPENSE, "교통비", "DC007"),
    HOUSING(CategoryType.EXPENSE, "주거비", "DC008"),
    COMMUNICATION(CategoryType.EXPENSE, "통신비", "DC009"),
    LIVING_SUPPLIES(CategoryType.EXPENSE, "생활용품", "DC010"),
    EVENTS(CategoryType.EXPENSE, "경조사비", "DC011"),
    EDUCATION_CULTURE(CategoryType.EXPENSE, "지식/문화", "DC012"),
    CLOTHING_BEAUTY(CategoryType.EXPENSE, "의복/미용", "DC013"),
    MEDICAL_HEALTH(CategoryType.EXPENSE, "의료/건강", "DC014"),
    LEISURE_ENTERTAINMENT(CategoryType.EXPENSE, "여가/유흥", "DC015"),
    TAX_INTEREST(CategoryType.EXPENSE, "세금/이자", "DC016"),
    OTHER_EXPENSE(CategoryType.EXPENSE, "기타비용", "DC017");

    private final CategoryType categoryType;
    private final String categoryName;
    private final String categoryCode;

}
