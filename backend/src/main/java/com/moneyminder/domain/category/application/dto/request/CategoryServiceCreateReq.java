package com.moneyminder.domain.category.application.dto.request;

import com.moneyminder.domain.category.domain.type.CategoryType;
import lombok.Builder;

@Builder
public record CategoryServiceCreateReq(

        String categoryName,

        String userEmail,

        CategoryType categoryType,

        String description

) {

}
