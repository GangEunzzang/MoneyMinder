package com.moneyminder.domain.category.presentation.dto.request;

import com.moneyminder.domain.category.application.dto.CategoryServiceUpdateReq;
import com.moneyminder.domain.category.domain.type.CategoryType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import org.hibernate.validator.constraints.Length;

@Builder
public record CategoryUpdateRequest(

        @NotEmpty
        @Size(max = 255)
        String categoryName,

        @NotEmpty
        String categoryType,

        @NotEmpty
        @Length(max = 255)
        String description,

        @NotNull
        Long categoryId

) {
    public CategoryServiceUpdateReq toService(String email) {
        return CategoryServiceUpdateReq.builder()
                .categoryName(categoryName)
                .categoryType(CategoryType.fromValue(categoryType))
                .description(description)
                .categoryId(categoryId)
                .userEmail(email)
                .build();
    }
}
