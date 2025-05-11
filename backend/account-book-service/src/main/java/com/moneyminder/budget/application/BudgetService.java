package com.moneyminder.budget.application;

import com.moneyminder.budget.application.dto.request.BudgetServiceCreateReq;
import com.moneyminder.budget.application.dto.request.BudgetServiceSearchReq;
import com.moneyminder.budget.application.dto.request.BudgetServiceUpdateReq;
import com.moneyminder.budget.application.dto.response.BudgetServiceRes;
import com.moneyminder.budget.domain.Budget;
import com.moneyminder.budget.domain.repository.BudgetRepository;
import com.moneyminder.category.domain.Category;
import com.moneyminder.category.domain.repository.CategoryRepository;
import com.moneyminder.exception.BaseException;
import com.moneyminder.exception.ResultCode;
import com.moneyminder.user.feign.UserApiResponse;
import com.moneyminder.user.feign.UserFeignClient;
import com.moneyminder.user.feign.UserFeignResponse;
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
    private final UserFeignClient userFeignClient;

    @Transactional
    public BudgetServiceRes create(BudgetServiceCreateReq request) {
        validateCategoryCode(request.categoryCode());

        BudgetServiceSearchReq search = BudgetServiceSearchReq.from(request.categoryCode(), request.year(), request.month());
        List<BudgetServiceRes> exists = budgetRepository.findByEmailAndSearch(request.userEmail(), search);

        if (!exists.isEmpty()) {
            throw new BaseException(ResultCode.BUDGET_ALREADY_EXISTS);
        }

        Budget budget = budgetRepository.save(Budget.create(request));
        return mapToServiceResponse(budget);
    }

    @Transactional
    public BudgetServiceRes update(BudgetServiceUpdateReq request) {
        Budget currentBudget = budgetRepository.getById(request.budgetId());

        validateUserEmail(currentBudget.userEmail(), request.userEmail());

        Budget updatedBudget = currentBudget.update(request);
        budgetRepository.save(updatedBudget);

        return mapToServiceResponse(updatedBudget);
    }

    @Transactional
    public void delete(Long budgetId, String email) {
        Budget budget = budgetRepository.getById(budgetId);

        validateUserEmail(budget.userEmail(), email);

        budgetRepository.delete(budget);
    }

    public UserFeignResponse testUserInfo(String email) {
        UserApiResponse<UserFeignResponse> userInfo = userFeignClient.getUserInfo(email);

        if (userInfo.getCode() != 200) {
            throw new BaseException(userInfo.getMessage());
        }

        return userInfo.getData();
    }

    public BudgetServiceRes getById(Long budgetId) {
        return budgetRepository.findById(budgetId)
                .map(this::mapToServiceResponse)
                .orElseThrow(() -> new BaseException(ResultCode.BUDGET_NOT_FOUND));
    }

    public List<BudgetServiceRes> getByEmailAndSearch(String email, BudgetServiceSearchReq searchReq) {
        return budgetRepository.findByEmailAndSearch(email, searchReq);
    }

    private BudgetServiceRes mapToServiceResponse(Budget budget) {
        Category category = categoryRepository.findByCategoryCode(budget.categoryCode())
                .orElseGet(Category::defaultCategory);

        return BudgetServiceRes.fromDomain(budget, category);
    }

    private void validateCategoryCode(String categoryCode) {
        if (!categoryRepository.existsByCategoryCode(categoryCode)) {
            throw new BaseException(ResultCode.CATEGORY_NOT_FOUND);
        }
    }

    private void validateUserEmail(String currentEmail, String updateEmail) {
        if (!currentEmail.equals(updateEmail)) {
            throw new BaseException(ResultCode.BUDGET_FORBIDDEN);
        }
    }


}
