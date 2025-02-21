package com.moneyminder.accountbook.application.dto.response;

import com.moneyminder.accountbook.domain.AccountBook;
import com.moneyminder.category.domain.Category;
import com.moneyminder.category.domain.type.CategoryType;
import lombok.Builder;

import java.math.BigInteger;
import java.time.LocalDate;


public record AccountBookDefaultRes(

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
    public AccountBookDefaultRes {
        categoryCode = categoryCode == null ? Category.DEFAULT_CATEGORY_CODE : categoryCode;
        categoryName = categoryName == null ? Category.DEFAULT_CATEGORY_NAME : categoryName;
        categoryType = categoryType == null ? CategoryType.ETC : categoryType;
    }

    public static AccountBookDefaultRes fromDomain(AccountBook accountBook, Category category) {
        return AccountBookDefaultRes.builder()
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
