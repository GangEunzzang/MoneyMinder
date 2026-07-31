package com.moneyminder.domain.category.application.dto.request;

import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.type.CategoryType;
import lombok.Builder;

@Builder
public record CategoryServiceCreateReq(

        String categoryName,

        String userEmail,

        CategoryType categoryType,

        String description

) {

    public Category toDomain() {
        return Category.create(categoryName, categoryType, description, userEmail);
    }
}
