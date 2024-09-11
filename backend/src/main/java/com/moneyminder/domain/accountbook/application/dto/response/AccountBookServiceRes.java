package com.moneyminder.domain.accountbook.application.dto.response;

import com.moneyminder.domain.accountbook.domain.AccountBook;
import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.type.CategoryType;
import com.querydsl.core.annotations.QueryProjection;
import lombok.Builder;

import java.math.BigInteger;
import java.time.LocalDate;


public record AccountBookServiceRes(

        Long accountId,

        BigInteger amount,

        LocalDate transactionDate,

        String memo,

        String categoryCode,

        String categoryName,

        CategoryType categoryType
) {

    @QueryProjection
    @Builder
    public AccountBookServiceRes {
        categoryCode = categoryCode == null ? Category.DEFAULT_CATEGORY_CODE : categoryCode;
        categoryName = categoryName == null ? Category.DEFAULT_CATEGORY_NAME : categoryName;
        categoryType = categoryType == null ? CategoryType.ETC : categoryType;
    }

    public static AccountBookServiceRes fromDomain(AccountBook accountBook, Category category) {
        return AccountBookServiceRes.builder()
                .accountId(accountBook.accountId())
                .amount(accountBook.amount())
                .transactionDate(accountBook.transactionDate())
                .memo(accountBook.memo())
                .categoryCode(category.categoryCode())
                .categoryName(category.categoryName())
                .categoryType(category.categoryType())
                .build();
    }


}
