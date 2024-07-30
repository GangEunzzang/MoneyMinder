package com.moneyminder.domain.category.application.dto.request;

import com.moneyminder.domain.category.domain.type.CategoryType;
import lombok.Builder;

@Builder
public record CategoryServiceUpdateReq(
        String categoryName,
        CategoryType categoryType,
        String description,

        Long categoryId,

        String userEmail
) {

}
