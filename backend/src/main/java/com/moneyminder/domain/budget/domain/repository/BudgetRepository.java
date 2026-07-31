package com.moneyminder.domain.budget.domain.repository;

import com.moneyminder.domain.budget.domain.Budget;
import com.moneyminder.domain.budget.domain.BudgetSearchCond;
import com.moneyminder.domain.budget.domain.BudgetWithCategory;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository {

    Budget save(Budget budget);

    void delete(Budget budget);

    void deleteAllInBatch();

    Budget getById(Long id);

    Optional<Budget> findById(Long id);

    List<BudgetWithCategory> findByEmailAndSearch(String email, BudgetSearchCond cond);

}
