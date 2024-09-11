package com.moneyminder.domain.accountbook.infrastructure.jpa.repository;


import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookServiceDefaultRes;

import java.util.List;

public interface AccountBookQueryRepository {

    AccountBookServiceDefaultRes findWithCategoryById(Long id);

    List<AccountBookServiceDefaultRes> findWithCategoryByEmail(String email);

    List<AccountBookServiceDefaultRes> findWithCategoryByEmailAndSearch(String email, AccountBookServiceSearchReq searchReq);
}
