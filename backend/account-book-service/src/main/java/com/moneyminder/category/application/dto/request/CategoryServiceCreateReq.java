package com.moneyminder.category.application.dto.request;

import com.moneyminder.category.domain.type.CategoryType;
import lombok.Builder;

@Builder
public record CategoryServiceCreateReq(

        String categoryName,

        String userEmail,

        CategoryType categoryType,

        String description

) {

}
