package com.moneyminder.domain.budget.infrastructure.jpa.repository;

import com.moneyminder.domain.budget.domain.BudgetSearchCond;
import com.moneyminder.domain.budget.domain.BudgetWithCategory;
import java.util.List;

public interface BudgetQueryRepository {

    List<BudgetWithCategory> findWithCategoryByEmailAndSearch(String email, BudgetSearchCond cond);
}
