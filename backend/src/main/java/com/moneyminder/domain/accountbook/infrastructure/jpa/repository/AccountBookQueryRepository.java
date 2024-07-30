package com.moneyminder.domain.accountbook.infrastructure.jpa.repository;


import com.moneyminder.domain.accountbook.application.dto.response.AccountBookServiceRes;
import java.util.List;

public interface AccountBookQueryRepository {

    AccountBookServiceRes findWithCategoryById(Long id);

    List<AccountBookServiceRes> findWithCategoryByEmail(String email);
}
