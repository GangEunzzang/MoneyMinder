package com.moneyminder.domain.budget.infrastructure.jpa.repository;

import com.moneyminder.domain.budget.domain.Budget;
import com.moneyminder.domain.budget.domain.BudgetSearchCond;
import com.moneyminder.domain.budget.domain.BudgetWithCategory;
import com.moneyminder.domain.budget.domain.repository.BudgetRepository;
import com.moneyminder.domain.budget.infrastructure.jpa.entity.BudgetEntity;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class BudgetRepositoryImpl implements BudgetRepository {

    private final BudgetJpaRepository budgetJpaRepository;

    @Override
    public Budget save(Budget budget) {
        return budgetJpaRepository.save(BudgetEntity.from(budget)).toDomain();
    }

    @Override
    public void delete(Budget budget) {
        budgetJpaRepository.delete(BudgetEntity.from(budget));
    }

    @Override
    public void deleteAllInBatch() {
        budgetJpaRepository.deleteAllInBatch();
    }

    @Override
    public Budget getById(Long id) {
        return findById(id).orElseThrow(() -> new BaseException(ResultCode.BUDGET_NOT_FOUND));
    }

    @Override
    public Optional<Budget> findById(Long id) {
        return budgetJpaRepository.findById(id).map(BudgetEntity::toDomain);
    }

    @Override
    public List<BudgetWithCategory> findByEmailAndSearch(String email, BudgetSearchCond cond) {
        return budgetJpaRepository.findWithCategoryByEmailAndSearch(email, cond);
    }


}
