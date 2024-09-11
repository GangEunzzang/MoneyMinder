package com.moneyminder.domain.budget.application;

import com.moneyminder.domain.budget.application.dto.request.BudgetServiceCreateReq;
import com.moneyminder.domain.budget.application.dto.request.BudgetServiceUpdateReq;
import com.moneyminder.domain.budget.application.dto.response.BudgetServiceRes;
import com.moneyminder.domain.budget.domain.Budget;
import com.moneyminder.domain.budget.domain.repository.BudgetRepository;
import com.moneyminder.domain.category.domain.repository.CategoryRepository;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class BudgetService {

    private final CategoryRepository categoryRepository;
    private final BudgetRepository budgetRepository;

    @Transactional
    public BudgetServiceRes create(BudgetServiceCreateReq request) {
        if (!categoryRepository.existsByCategoryCode(request.categoryCode())) {
            throw new BaseException(ResultCode.CATEGORY_NOT_FOUND);
        }

        budgetRepository.findByUserEmailAndYearAndtMonth(request.userEmail(), request.year(), request.month())
                .ifPresent(budget -> {
                    throw new BaseException(ResultCode.BUDGET_ALREADY_EXISTS);
                });

        Budget budget = budgetRepository.save(Budget.create(request));
        return BudgetServiceRes.fromDomain(budget);
    }

    @Transactional
    public BudgetServiceRes update(BudgetServiceUpdateReq request) {
        Budget currentBudget = budgetRepository.getById(request.budgetId());

        validateUserEmail(currentBudget.userEmail(), request.userEmail());

        Budget updatedBudget = currentBudget.update(request);
        budgetRepository.save(updatedBudget);

        return BudgetServiceRes.fromDomain(updatedBudget);
    }

    @Transactional
    public void delete(Long budgetId, String email) {
        Budget budget = budgetRepository.getById(budgetId);

        validateUserEmail(budget.userEmail(), email);

        budgetRepository.delete(budget);
    }

    public BudgetServiceRes getById(Long budgetId) {
        return budgetRepository.findById(budgetId)
                .map(BudgetServiceRes::fromDomain)
                .orElseThrow(() -> new BaseException(ResultCode.BUDGET_NOT_FOUND));
    }

    public List<BudgetServiceRes> getByUserEmailAndYear(String email, Integer year) {
        return budgetRepository.findByUserEmailAndYear(email, year).stream()
                .map(BudgetServiceRes::fromDomain)
                .toList();
    }

    public BudgetServiceRes getByUserEmailAndYearAndMonth(String email, Integer year, Integer month) {
        return budgetRepository.findByUserEmailAndYearAndtMonth(email, year, month)
                .map(BudgetServiceRes::fromDomain)
                .orElseThrow(() -> new BaseException(ResultCode.BUDGET_NOT_FOUND));
    }

    private void validateUserEmail(String currentEmail, String updateEmail) {
        if (!currentEmail.equals(updateEmail)) {
            throw new BaseException(ResultCode.BUDGET_FORBIDDEN);
        }
    }


}
