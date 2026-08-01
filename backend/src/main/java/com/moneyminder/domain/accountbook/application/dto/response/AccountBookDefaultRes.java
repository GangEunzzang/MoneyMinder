package com.moneyminder.domain.accountbook.application.dto.response;

import com.moneyminder.domain.accountbook.domain.AccountBook;
import com.moneyminder.domain.accountbook.domain.AccountBookWithCategory;
import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.type.CategoryType;
import java.math.BigInteger;
import java.time.LocalDate;
import lombok.Builder;

public record AccountBookDefaultRes(

        Long accountId,

        BigInteger amount,

        LocalDate transactionDate,

        String memo,

        Long paymentMethodId,

        String merchant,

        boolean autoRecorded,

        String categoryCode,

        String categoryName,

        CategoryType categoryType
) {

    @Builder
    public AccountBookDefaultRes {
        categoryCode = categoryCode == null ? Category.DEFAULT_CATEGORY_CODE : categoryCode;
        categoryName = categoryName == null ? Category.DEFAULT_CATEGORY_NAME : categoryName;
        categoryType = categoryType == null ? CategoryType.ETC : categoryType;
    }

    public static AccountBookDefaultRes from(AccountBookWithCategory withCategory) {
        return AccountBookDefaultRes.builder()
                .accountId(withCategory.accountId())
                .amount(withCategory.amount())
                .transactionDate(withCategory.transactionDate())
                .memo(withCategory.memo())
                .paymentMethodId(withCategory.paymentMethodId())
                .merchant(withCategory.merchant())
                .autoRecorded(Boolean.TRUE.equals(withCategory.autoRecorded()))
                .categoryCode(withCategory.categoryCode())
                .categoryName(withCategory.categoryName())
                .categoryType(withCategory.categoryType())
                .build();
    }

    public static AccountBookDefaultRes fromDomain(AccountBook accountBook, Category category) {
        return AccountBookDefaultRes.builder()
                .accountId(accountBook.getAccountId())
                .amount(accountBook.getAmount())
                .transactionDate(accountBook.getTransactionDate())
                .memo(accountBook.getMemo())
                .paymentMethodId(accountBook.getPaymentMethodId())
                .merchant(accountBook.getMerchant())
                .autoRecorded(accountBook.isAutoRecorded())
                .categoryCode(category.getCategoryCode())
                .categoryName(category.getCategoryName())
                .categoryType(category.getCategoryType())
                .build();
    }
}
