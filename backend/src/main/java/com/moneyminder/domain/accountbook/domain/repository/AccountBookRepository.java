package com.moneyminder.domain.accountbook.domain.repository;

import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookServiceDefaultRes;
import com.moneyminder.domain.accountbook.domain.AccountBook;

import java.util.List;
import java.util.Optional;

public interface AccountBookRepository {

    AccountBook save(AccountBook accountBook);

    void delete(AccountBook accountBook);

    void deleteAllInBatch();

    AccountBook getById(Long id);

    Optional<AccountBook> findById(Long id);

    Optional<AccountBookServiceDefaultRes> findWithCategoryById(Long id);

    List<AccountBookServiceDefaultRes> findWithCategoryByEmail(String email);

    List<AccountBookServiceDefaultRes> findWithCategoryByEmailAndSearch(String email, AccountBookServiceSearchReq searchReq);
}
