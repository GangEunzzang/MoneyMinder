package com.moneyminder.domain.category.presentation.dto.request;

import com.moneyminder.domain.category.application.dto.CategoryServiceCreateReq;
import com.moneyminder.domain.category.domain.type.CategoryType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record CategoryCreateReq(

        @NotEmpty
        @Size(max = 255)
        String categoryName,

        @NotEmpty
        String categoryType,

        @NotEmpty
        @Size(max = 255)
        String description
) {
    public CategoryServiceCreateReq toService(String email) {
        return CategoryServiceCreateReq.builder()
                .categoryName(categoryName)
                .categoryType(CategoryType.fromValue(categoryType))
                .description(description)
                .userEmail(email)
                .build();
    }
}
