package com.moneyminder.domain.budget.presentation;

import com.moneyminder.domain.budget.application.BudgetService;
import com.moneyminder.domain.budget.application.dto.request.BudgetServiceSearchReq;
import com.moneyminder.domain.budget.application.dto.response.BudgetServiceRes;
import com.moneyminder.domain.budget.presentation.dto.BudgetCreateReq;
import com.moneyminder.domain.budget.presentation.dto.BudgetUpdateReq;
import com.moneyminder.global.annotation.CurrentUserEmail;
import com.moneyminder.global.response.DataResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/budgets")
@RestController
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public DataResponse<BudgetServiceRes> create(@CurrentUserEmail String email,
            @Valid @RequestBody BudgetCreateReq request) {
        return DataResponse.of(budgetService.create(request.toService(email)));
    }

    @PutMapping("/{budgetId}")
    public DataResponse<BudgetServiceRes> update(@CurrentUserEmail String email, @PathVariable Long budgetId,
            @Valid @RequestBody BudgetUpdateReq request) {
        return DataResponse.of(budgetService.update(request.toService(budgetId, email)));
    }

    @DeleteMapping("/{budgetId}")
    public DataResponse<Void> delete(@CurrentUserEmail String email, @PathVariable Long budgetId) {
        budgetService.delete(budgetId, email);

        return DataResponse.empty();
    }

    @GetMapping("/{budgetId}")
    public DataResponse<BudgetServiceRes> getById(@PathVariable Long budgetId) {
        return DataResponse.of(budgetService.getById(budgetId));
    }

    @GetMapping
    public DataResponse<List<BudgetServiceRes>> getMine(
            @CurrentUserEmail String email,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) String categoryCode
    ) {
        BudgetServiceSearchReq searchReq = BudgetServiceSearchReq.from(categoryCode, year, month);

        return DataResponse.of(budgetService.getByEmailAndSearch(email, searchReq));
    }
}
