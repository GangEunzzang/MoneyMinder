package com.moneyminder.domain.category.presentation.dto;

import com.moneyminder.domain.category.application.dto.request.CategoryServiceUpdateReq;
import com.moneyminder.domain.category.domain.type.CategoryType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import org.hibernate.validator.constraints.Length;

@Builder
public record CategoryUpdateReq(

        @NotEmpty
        @Size(max = 255)
        String categoryName,

        @NotEmpty
        String categoryType,

        @NotEmpty
        @Length(max = 255)
        String description,

        @Length(max = 30)
        String icon,

        @Length(max = 30)
        String color

) {

    public CategoryServiceUpdateReq toService(Long categoryId, String email) {
        return CategoryServiceUpdateReq.builder()
                .categoryName(categoryName)
                .categoryType(CategoryType.fromValue(categoryType))
                .description(description)
                .icon(icon)
                .color(color)
                .categoryId(categoryId)
                .userEmail(email)
                .build();
    }
}
