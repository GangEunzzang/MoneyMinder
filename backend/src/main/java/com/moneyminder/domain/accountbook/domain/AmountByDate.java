package com.moneyminder.domain.accountbook.domain;

import com.moneyminder.domain.category.domain.type.CategoryType;
import java.math.BigInteger;
import java.time.LocalDate;

public record AmountByDate(
        LocalDate transactionDate,
        CategoryType categoryType,
        BigInteger total
) {
}
