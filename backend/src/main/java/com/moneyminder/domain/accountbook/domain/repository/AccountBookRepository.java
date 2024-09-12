package com.moneyminder.domain.accountbook.domain.repository;

import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookDefaultRes;
import com.moneyminder.domain.accountbook.domain.AccountBook;

import java.util.List;
import java.util.Optional;

public interface AccountBookRepository {

    AccountBook save(AccountBook accountBook);

    void delete(AccountBook accountBook);

    void deleteAllInBatch();

    AccountBook getById(Long id);

    Optional<AccountBook> findById(Long id);

    Optional<AccountBookDefaultRes> findWithCategoryById(Long id);

    List<AccountBookDefaultRes> findWithCategoryByEmail(String email);

    List<AccountBookDefaultRes> findWithCategoryByEmailAndSearch(String email, AccountBookServiceSearchReq searchReq);
}
