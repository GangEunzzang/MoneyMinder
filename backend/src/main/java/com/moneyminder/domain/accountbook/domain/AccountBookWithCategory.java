package com.moneyminder.domain.accountbook.domain;

import com.moneyminder.domain.category.domain.type.CategoryType;
import java.math.BigInteger;
import java.time.LocalDate;

/**
 * 거래에 카테고리를 붙인 조회 결과. 조인 한 번으로 채워지므로 행마다 카테고리를 다시 묻지 않는다.
 */
public record AccountBookWithCategory(
        Long accountId,
        BigInteger amount,
        LocalDate transactionDate,
        String memo,
        String categoryCode,
        String categoryName,
        CategoryType categoryType
) {
}
