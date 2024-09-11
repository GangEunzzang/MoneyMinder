package com.moneyminder.domain.budget.domain.repository;

import com.moneyminder.domain.budget.application.dto.request.BudgetServiceSearchReq;
import com.moneyminder.domain.budget.application.dto.response.BudgetServiceRes;
import com.moneyminder.domain.budget.domain.Budget;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository {

    Budget save(Budget budget);

    void delete(Budget budget);

    void deleteAllInBatch();

    Budget getById(Long id);

    Optional<Budget> findById(Long id);

    List<BudgetServiceRes> findByEmailAndSearch(String email, BudgetServiceSearchReq searchReq);

}
