package com.moneyminder.budget.presentation;

import com.moneyminder.annotaion.CurrentUserEmail;
import com.moneyminder.budget.application.BudgetService;
import com.moneyminder.budget.application.dto.request.BudgetServiceCreateReq;
import com.moneyminder.budget.application.dto.request.BudgetServiceSearchReq;
import com.moneyminder.budget.application.dto.request.BudgetServiceUpdateReq;
import com.moneyminder.budget.application.dto.response.BudgetServiceRes;
import com.moneyminder.budget.presentation.dto.BudgetCreateReq;
import com.moneyminder.budget.presentation.dto.BudgetUpdateReq;
import com.moneyminder.response.APIResponse;
import com.moneyminder.response.DataResponse;
import com.moneyminder.user.feign.UserFeignResponse;
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

    @GetMapping("/search")
    public DataResponse<List<BudgetServiceRes>> findBySearch(
            @CurrentUserEmail String email,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) String categoryCode
    ) {
        BudgetServiceSearchReq searchReq = BudgetServiceSearchReq.from(categoryCode, year, month);

        List<BudgetServiceRes> response = budgetService.getByEmailAndSearch(email, searchReq);
        return DataResponse.of(response);
    }

    @GetMapping("/testUserInfo")
    public APIResponse testUserInfo() {
        UserFeignResponse userFeignResponse = budgetService.testUserInfo("rkddms123456@gmail.com");
        return DataResponse.of(userFeignResponse);
    }

}
