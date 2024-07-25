package com.moneyminder.domain.category.presentation.dto.response;

import com.moneyminder.domain.category.domain.Category;
import lombok.Builder;

@Builder
public record CategoryResponse(
        Long id,
        String categoryName,
        String categoryCode,
        String categoryType,
        String description,
        Boolean isCustom
) {

    public static CategoryResponse fromDomain(Category category) {
        return CategoryResponse.builder()
                .id(category.id())
                .categoryName(category.categoryName())
                .categoryCode(category.categoryCode())
                .categoryType(category.categoryType().name())
                .description(category.description())
                .isCustom(category.isCustom())
                .build();
    }

}
