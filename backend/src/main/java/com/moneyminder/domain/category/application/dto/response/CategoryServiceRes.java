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
        String icon,
        String color,
        Boolean isCustom
) {

    public static CategoryServiceRes fromDomain(Category category) {
        return CategoryServiceRes.builder()
                .categoryId(category.getId())
                .categoryName(category.getCategoryName())
                .categoryCode(category.getCategoryCode())
                .categoryType(category.getCategoryType().name())
                .description(category.getDescription())
                .icon(category.getIcon())
                .color(category.getColor())
                .isCustom(category.isCustom())
                .build();
    }

}
