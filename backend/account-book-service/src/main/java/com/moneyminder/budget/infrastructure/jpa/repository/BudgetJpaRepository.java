package com.moneyminder.budget.infrastructure.jpa.repository;

import com.moneyminder.budget.infrastructure.jpa.entity.BudgetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetJpaRepository extends JpaRepository<BudgetEntity, Long>, BudgetQueryRepository {
}
