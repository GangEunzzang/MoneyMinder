package com.moneyminder.domain.accountbook.domain;

import com.moneyminder.domain.category.domain.type.CategoryType;
import java.math.BigInteger;

public record AmountByMonth(
        Integer month,
        CategoryType categoryType,
        BigInteger total
) {
}
