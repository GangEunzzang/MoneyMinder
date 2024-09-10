package com.moneyminder.domain.budget.infrastructure.jpa.repository;

import com.moneyminder.domain.budget.domain.Budget;
import com.moneyminder.domain.budget.domain.repository.BudgetRepository;
import com.moneyminder.domain.budget.infrastructure.jpa.entity.BudgetEntity;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Repository
public class BudgetRepositoryImpl implements BudgetRepository {

    private final BudgetJpaRepository budgetJpaRepository;

    @Override
    public Budget save(Budget budget) {
        return budgetJpaRepository.save(budget.toEntity()).toDomain();
    }

    @Override
    public void delete(Budget budget) {
        budgetJpaRepository.delete(budget.toEntity());
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
    public List<Budget> findByUserEmailAndYear(String userEmail, Integer year) {
        return budgetJpaRepository.findByUserEmailAndBudgetYear(userEmail, year).stream()
                .map(BudgetEntity::toDomain)
                .toList();
    }

    @Override
    public Optional<Budget> findByUserEmailAndYearAndtMonth(String userEmail, Integer year, Integer month) {
        return budgetJpaRepository.findByUserEmailAndBudgetYearAndBudgetMonth(userEmail, year, month).map(BudgetEntity::toDomain);
    }


}
