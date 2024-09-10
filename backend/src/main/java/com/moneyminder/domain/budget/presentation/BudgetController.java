package com.moneyminder.domain.budget.presentation;

import com.moneyminder.domain.budget.application.BudgetService;
import com.moneyminder.domain.budget.application.dto.request.BudgetServiceCreateReq;
import com.moneyminder.domain.budget.application.dto.request.BudgetServiceUpdateReq;
import com.moneyminder.domain.budget.application.dto.response.BudgetServiceRes;
import com.moneyminder.domain.budget.presentation.dto.BudgetCreateReq;
import com.moneyminder.domain.budget.presentation.dto.BudgetUpdateReq;
import com.moneyminder.global.annotaion.CurrentUserEmail;
import com.moneyminder.global.response.APIResponse;
import com.moneyminder.global.response.DataResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/budget")
@RestController
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping("/create")
    public DataResponse<BudgetServiceRes> create(@CurrentUserEmail String email,
                                                 @Valid @RequestBody BudgetCreateReq request) {
        BudgetServiceCreateReq serviceRequest = request.toService(email);
        BudgetServiceRes response = budgetService.create(serviceRequest);

        return DataResponse.of(response);
    }

    @PutMapping("/update")
    public DataResponse<BudgetServiceRes> update(@CurrentUserEmail String email,
                                                 @Valid @RequestBody BudgetUpdateReq request) {
        BudgetServiceUpdateReq serviceRequest = request.toService(email);
        BudgetServiceRes response = budgetService.update(serviceRequest);

        return DataResponse.of(response);
    }

    @DeleteMapping("/delete/{budgetId}")
    public APIResponse delete(@CurrentUserEmail String email, @PathVariable Long budgetId) {
        budgetService.delete(budgetId, email);

        return DataResponse.empty();
    }

    @GetMapping("/id/{budgetId}")
    public DataResponse<BudgetServiceRes> findByBudgetId(@PathVariable Long budgetId) {
        BudgetServiceRes response = budgetService.getById(budgetId);

        return DataResponse.of(response);
    }

    @GetMapping("/year")
    public DataResponse<List<BudgetServiceRes>> findByYear(@CurrentUserEmail String email, @RequestParam Integer year) {
        List<BudgetServiceRes> response = budgetService.getByUserEmailAndYear(email, year);

        return DataResponse.of(response);
    }

    @GetMapping("/year/month")
    public DataResponse<BudgetServiceRes> findByYearAndMonth(@CurrentUserEmail String email, @RequestParam Integer year, @RequestParam Integer month) {
        BudgetServiceRes response = budgetService.getByUserEmailAndYearAndMonth(email, year, month);

        return DataResponse.of(response);
    }
}
