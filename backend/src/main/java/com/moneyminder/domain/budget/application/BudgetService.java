package com.moneyminder.domain.budget.application;

import com.moneyminder.domain.budget.application.dto.request.BudgetServiceCreateReq;
import com.moneyminder.domain.budget.application.dto.request.BudgetServiceSearchReq;
import com.moneyminder.domain.budget.application.dto.request.BudgetServiceUpdateReq;
import com.moneyminder.domain.budget.application.dto.response.BudgetServiceRes;
import com.moneyminder.domain.budget.domain.Budget;
import com.moneyminder.domain.budget.domain.BudgetWithCategory;
import com.moneyminder.domain.budget.domain.repository.BudgetRepository;
import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.repository.CategoryRepository;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
public class BudgetService {

    private final CategoryRepository categoryRepository;
    private final BudgetRepository budgetRepository;

    @Transactional
    public BudgetServiceRes create(BudgetServiceCreateReq request) {
        validateCategoryCode(request.categoryCode());

        BudgetServiceSearchReq search = BudgetServiceSearchReq.from(request.categoryCode(), request.year(),
                request.month());
        List<BudgetWithCategory> exists = budgetRepository.findByEmailAndSearch(request.userEmail(), search.toCond());

        if (!exists.isEmpty()) {
            throw new BaseException(ResultCode.BUDGET_ALREADY_EXISTS);
        }

        Budget budget = budgetRepository.save(request.toDomain());
        return mapToServiceResponse(budget);
    }

    @Transactional
    public BudgetServiceRes update(BudgetServiceUpdateReq request) {
        Budget budget = budgetRepository.getById(request.budgetId());

        budget.validateOwner(request.userEmail());
        budget.changeAmount(request.amount());

        budgetRepository.save(budget);

        return mapToServiceResponse(budget);
    }

    @Transactional
    public void delete(Long budgetId, String email) {
        Budget budget = budgetRepository.getById(budgetId);

        budget.validateOwner(email);

        budgetRepository.delete(budget);
    }

    @Transactional(readOnly = true)
    public BudgetServiceRes getById(Long budgetId) {
        return budgetRepository.findById(budgetId)
                .map(this::mapToServiceResponse)
                .orElseThrow(() -> new BaseException(ResultCode.BUDGET_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public List<BudgetServiceRes> getByEmailAndSearch(String email, BudgetServiceSearchReq searchReq) {
        return budgetRepository.findByEmailAndSearch(email, searchReq.toCond()).stream()
                .map(BudgetServiceRes::from)
                .toList();
    }

    private BudgetServiceRes mapToServiceResponse(Budget budget) {
        Category category = categoryRepository.findByCategoryCode(budget.getCategoryCode())
                .orElseGet(Category::defaultCategory);

        return BudgetServiceRes.fromDomain(budget, category);
    }

    private void validateCategoryCode(String categoryCode) {
        if (!categoryRepository.existsByCategoryCode(categoryCode)) {
            throw new BaseException(ResultCode.CATEGORY_NOT_FOUND);
        }
    }

}
