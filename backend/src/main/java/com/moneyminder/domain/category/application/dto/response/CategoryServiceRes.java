package com.moneyminder.domain.category.application.dto.response;

import com.moneyminder.domain.category.domain.Category;
import lombok.Builder;

@Builder
public record CategoryServiceRes(
        Long categoryId,
        String categoryName,
        String categoryCode,
        String categoryType,
        String description,
        Boolean isCustom
) {

    public static CategoryServiceRes fromDomain(Category category) {
        return CategoryServiceRes.builder()
                .categoryId(category.id())
                .categoryName(category.categoryName())
                .categoryCode(category.categoryCode())
                .categoryType(category.categoryType().name())
                .description(category.description())
                .isCustom(category.isCustom())
                .build();
    }

}
