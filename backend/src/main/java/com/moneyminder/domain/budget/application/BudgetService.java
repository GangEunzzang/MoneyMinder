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
import java.util.Objects;
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
        List<BudgetWithCategory> sameMonth = budgetRepository.findByEmailAndSearch(request.userEmail(),
                search.toCond());

        // categoryCode 가 null(총액)이면 조회 조건에서 빠져 그 달 전체가 걸린다. 같은 대상만 본다.
        boolean duplicated = sameMonth.stream()
                .anyMatch(budget -> Objects.equals(budget.categoryCode(), request.categoryCode()));

        if (duplicated) {
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
        if (budget.isTotal()) {
            return BudgetServiceRes.forTotal(budget);
        }

        Category category = categoryRepository.findByCategoryCode(budget.getCategoryCode())
                .orElseGet(Category::defaultCategory);

        return BudgetServiceRes.fromDomain(budget, category);
    }

    /** 총액 예산은 카테고리가 없다. 없는 것을 검사하면 그 달 한도를 아예 세울 수 없다. */
    private void validateCategoryCode(String categoryCode) {
        if (categoryCode == null) {
            return;
        }

        if (!categoryRepository.existsByCategoryCode(categoryCode)) {
            throw new BaseException(ResultCode.CATEGORY_NOT_FOUND);
        }
    }

}
