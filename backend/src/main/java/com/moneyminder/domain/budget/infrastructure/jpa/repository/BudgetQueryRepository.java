package com.moneyminder.domain.budget.infrastructure.jpa.repository;

import com.moneyminder.domain.budget.application.dto.request.BudgetServiceSearchReq;
import com.moneyminder.domain.budget.application.dto.response.BudgetServiceRes;

import java.util.List;

public interface BudgetQueryRepository {

    List<BudgetServiceRes> findWithCategoryByEmailAndSearch(String email, BudgetServiceSearchReq searchReq);
}
