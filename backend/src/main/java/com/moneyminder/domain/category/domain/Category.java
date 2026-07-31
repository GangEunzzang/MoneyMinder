package com.moneyminder.domain.category.domain;

import com.moneyminder.domain.category.domain.type.CategoryType;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import com.moneyminder.global.util.SnowflakeIdUtil;
import lombok.Builder;
import lombok.Getter;
import org.springframework.util.Assert;

@Getter
public class Category {

    public static final String CUSTOM_CATEGORY_CODE_PREFIX = "CC";
    public static final String DEFAULT_CATEGORY_CODE = "DEFAULT_CODE";
    public static final String DEFAULT_USER_EMAIL = "DEFAULT_CATEGORY";
    public static final String DEFAULT_CATEGORY_NAME = "기본 카테고리";
    public static final SnowflakeIdUtil SNOWFLAKE_ID_UTIL = new SnowflakeIdUtil(1, 1);

    private final Long id;
    private final String categoryCode;
    private final String userEmail;
    private final boolean isCustom;
    private String categoryName;
    private CategoryType categoryType;
    private String description;

    @Builder
    private Category(Long id, String categoryName, String categoryCode, CategoryType categoryType, boolean isCustom,
            String userEmail, String description) {
        Assert.hasText(categoryName, "categoryName must not be empty");
        Assert.hasText(categoryCode, "categoryCode must not be empty");
        Assert.notNull(categoryType, "categoryType must not be empty");
        Assert.hasText(userEmail, "userEmail must not be empty");
        Assert.notNull(description, "description must not be empty");

        this.id = id;
        this.categoryName = categoryName;
        this.categoryCode = categoryCode;
        this.categoryType = categoryType;
        this.isCustom = isCustom;
        this.userEmail = userEmail;
        this.description = description;
    }

    public static String generateCategoryCode() {
        return CUSTOM_CATEGORY_CODE_PREFIX + SNOWFLAKE_ID_UTIL.nextId();
    }

    public static Category defaultCategory() {
        return Category.builder()
                .categoryName(DEFAULT_CATEGORY_NAME)
                .categoryType(CategoryType.ETC)
                .description("기본 카테고리입니다.")
                .categoryCode(DEFAULT_CATEGORY_CODE)
                .isCustom(false)
                .userEmail(DEFAULT_USER_EMAIL)
                .build();
    }

    public static Category create(String categoryName, CategoryType categoryType, String description,
            String userEmail) {
        return Category.builder()
                .categoryName(categoryName)
                .categoryType(categoryType)
                .description(description)
                .categoryCode(generateCategoryCode())
                .isCustom(true)
                .userEmail(userEmail)
                .build();
    }

    public void update(String categoryName, CategoryType categoryType, String description) {
        Assert.hasText(categoryName, "categoryName must not be empty");
        Assert.notNull(categoryType, "categoryType must not be empty");
        Assert.notNull(description, "description must not be empty");

        this.categoryName = categoryName;
        this.categoryType = categoryType;
        this.description = description;
    }

    public boolean isOwnedBy(String email) {
        return userEmail.equals(email);
    }

    public void validateOwner(String email) {
        if (!isOwnedBy(email)) {
            throw new BaseException(ResultCode.CATEGORY_BOOK_FORBIDDEN);
        }
    }

    /**
     * 모든 사용자가 함께 쓰는 카테고리. 특정 사용자의 것이 아니라 소유자 검사가 통하지 않는다.
     */
    public boolean isDefault() {
        return !isCustom;
    }

    public boolean isExpense() {
        return CategoryType.EXPENSE.equals(categoryType);
    }

    public boolean isIncome() {
        return CategoryType.INCOME.equals(categoryType);
    }
}
