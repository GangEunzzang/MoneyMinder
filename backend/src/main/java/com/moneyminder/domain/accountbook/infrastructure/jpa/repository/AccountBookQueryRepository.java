package com.moneyminder.domain.accountbook.infrastructure.jpa.repository;


import com.moneyminder.domain.accountbook.application.dto.request.AccountBookMonthSummaryReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookDefaultRes;

import java.math.BigInteger;
import java.util.List;

public interface AccountBookQueryRepository {

    AccountBookDefaultRes findWithCategoryById(Long id);

    List<AccountBookDefaultRes> findWithCategoryByEmail(String email);

    List<AccountBookDefaultRes> findWithCategoryByEmailAndSearch(String email, AccountBookServiceSearchReq searchReq);

    BigInteger findMonthlyTotalByCategory(String email, AccountBookMonthSummaryReq summaryReq);
}
