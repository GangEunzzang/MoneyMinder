package com.moneyminder.domain.category.domain;

import com.moneyminder.domain.category.Infrastructure.jpa.entity.CategoryEntity;
import com.moneyminder.domain.category.application.dto.CategoryServiceCreateReq;
import com.moneyminder.domain.category.application.dto.CategoryServiceUpdateReq;
import com.moneyminder.domain.category.domain.type.CategoryType;
import com.moneyminder.global.util.SnowflakeIdUtil;
import lombok.Builder;
import org.springframework.util.Assert;

public record Category(
        Long id,
        String categoryName,
        String categoryCode,
        CategoryType categoryType,
        Boolean isCustom,
        String userEmail,
        String description
) {

    public static final String CUSTOM_CATEGORY_CODE_PREFIX = "CC";
    public static final SnowflakeIdUtil SNOWFLAKE_ID_UTIL = new SnowflakeIdUtil(1, 1);

    @Builder
    public Category {
        Assert.hasText(categoryName, "categoryName must not be empty");
        Assert.hasText(categoryCode, "categoryCode must not be empty");
        Assert.notNull(categoryType, "categoryType must not be empty");
        Assert.notNull(isCustom, "isCustom must not be empty");
        Assert.hasText(userEmail, "userEmail must not be empty");
        Assert.notNull(description, "description must not be empty");
    }

    public static String generateCategoryCode() {
        return CUSTOM_CATEGORY_CODE_PREFIX + SNOWFLAKE_ID_UTIL.nextId();
    }

    public static Category create(CategoryServiceCreateReq createReq) {
        return Category.builder()
                .categoryName(createReq.categoryName())
                .categoryType(createReq.categoryType())
                .description(createReq.description())
                .categoryCode(generateCategoryCode())
                .isCustom(true)
                .userEmail(createReq.userEmail())
                .build();
    }

    public Category update(CategoryServiceUpdateReq update) {
        return Category.builder()
                .id(id)
                .categoryName(update.categoryName())
                .categoryType(update.categoryType())
                .description(update.description())
                .categoryCode(categoryCode)
                .isCustom(isCustom)
                .userEmail(userEmail)
                .build();
    }

    public CategoryEntity toEntity() {
        return CategoryEntity.builder()
                .id(id)
                .categoryName(categoryName)
                .categoryCode(categoryCode)
                .categoryType(categoryType)
                .isCustom(isCustom)
                .userEmail(userEmail)
                .description(description)
                .build();
    }
}
