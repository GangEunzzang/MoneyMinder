package com.moneyminder.domain.accountbook.infrastructure.jpa.repository;


import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookServiceRes;
import java.util.List;
import java.util.Optional;

public interface AccountBookQueryRepository {

    AccountBookServiceRes findWithCategoryById(Long id);

    List<AccountBookServiceRes> findWithCategoryByEmail(String email);

    List<AccountBookServiceRes> findWithCategoryByEmailAndCursorAndSearch(String email, Optional<Long> cursorId, AccountBookServiceSearchReq searchReq);
}
