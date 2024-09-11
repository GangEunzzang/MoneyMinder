package com.moneyminder.domain.budget.infrastructure.jpa.repository;

import com.moneyminder.domain.budget.infrastructure.jpa.entity.BudgetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetJpaRepository extends JpaRepository<BudgetEntity, Long>, BudgetQueryRepository {
}