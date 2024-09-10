package com.moneyminder.domain.budget.domain.repository;

import com.moneyminder.domain.budget.domain.Budget;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository {

    Budget save(Budget budget);

    void delete(Budget budget);

    void deleteAllInBatch();

    Budget getById(Long id);

    Optional<Budget> findById(Long id);

    List<Budget> findByUserEmailAndYear(String userEmail, Integer year);

    Optional<Budget> findByUserEmailAndYearAndtMonth(String userEmail, Integer year, Integer month);


}
