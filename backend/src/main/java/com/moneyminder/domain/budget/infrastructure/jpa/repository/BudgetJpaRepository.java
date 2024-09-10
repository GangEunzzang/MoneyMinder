package com.moneyminder.domain.budget.infrastructure.jpa.repository;

import com.moneyminder.domain.budget.infrastructure.jpa.entity.BudgetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetJpaRepository extends JpaRepository<BudgetEntity, Long> {
    List<BudgetEntity> findByUserEmailAndBudgetYear(String userEmail, Integer year);

    Optional<BudgetEntity> findByUserEmailAndBudgetYearAndBudgetMonth(String userEmail, Integer year, Integer month);
}