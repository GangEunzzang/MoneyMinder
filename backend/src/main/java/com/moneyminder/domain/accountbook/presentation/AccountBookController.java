package com.moneyminder.domain.accountbook.presentation;

import com.moneyminder.domain.accountbook.application.AccountBookService;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceCreateReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceUpdateReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookCategorySummaryRes;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookDefaultRes;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookMonthSummaryRes;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookYearSummaryRes;
import com.moneyminder.domain.accountbook.presentation.dto.AccountBookCreateReq;
import com.moneyminder.domain.accountbook.presentation.dto.AccountBookUpdateReq;
import com.moneyminder.global.annotaion.CurrentUserEmail;
import com.moneyminder.global.response.APIResponse;
import com.moneyminder.global.response.DataResponse;
import jakarta.validation.Valid;
import java.time.LocalDate;
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
@RequestMapping("/api/v1/accountBook")
@RestController
public class AccountBookController {

    private final AccountBookService accountBookService;

    @PostMapping("/create")
    public DataResponse<AccountBookDefaultRes> create(@CurrentUserEmail String email,
            @Valid @RequestBody AccountBookCreateReq request) {
        AccountBookServiceCreateReq serviceRequest = request.toService(email);
        AccountBookDefaultRes response = accountBookService.create(serviceRequest);
        return DataResponse.of(response);
    }

    @PutMapping("/update")
    public DataResponse<AccountBookDefaultRes> update(@CurrentUserEmail String email,
            @Valid @RequestBody AccountBookUpdateReq request) {
        AccountBookServiceUpdateReq serviceRequest = request.toService(email);
        AccountBookDefaultRes response = accountBookService.update(serviceRequest);
        return DataResponse.of(response);
    }

    @DeleteMapping("/delete/{accountId}")
    public APIResponse delete(@CurrentUserEmail String email, @PathVariable Long accountId) {
        accountBookService.delete(accountId, email);

        return DataResponse.empty();
    }

    @GetMapping("/id/{accountId}")
    public DataResponse<AccountBookDefaultRes> findByAccountId(@PathVariable Long accountId) {
        AccountBookDefaultRes response = accountBookService.getById(accountId);
        return DataResponse.of(response);
    }

    @GetMapping("/email")
    public DataResponse<List<AccountBookDefaultRes>> findByUserEmail(@CurrentUserEmail String email) {
        List<AccountBookDefaultRes> response = accountBookService.getByUserEmail(email);
        return DataResponse.of(response);
    }

    @GetMapping("/search")
    public DataResponse<List<AccountBookDefaultRes>> findBySearch(
            @CurrentUserEmail String email,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String memo
    ) {
        AccountBookServiceSearchReq searchReq = AccountBookServiceSearchReq.from(categoryCode, startDate, endDate, memo,
                cursorId);

        List<AccountBookDefaultRes> response = accountBookService.getByUserEmailAndSearch(email, searchReq);
        return DataResponse.of(response);
    }

    @GetMapping("/year-summary")
    public DataResponse<AccountBookYearSummaryRes> getYearlySummary(
            @CurrentUserEmail String email,
            @RequestParam Integer year
    ) {
        return DataResponse.of(accountBookService.getYearSummary(email, year));
    }

    @GetMapping("/month-summary")
    public DataResponse<AccountBookMonthSummaryRes> getMonthlySummary(
            @CurrentUserEmail String email,
            @RequestParam Integer year,
            @RequestParam Integer month
    ) {
        return DataResponse.of(accountBookService.getMonthSummary(email, year, month));
    }

    @GetMapping("/category-total")
    public DataResponse<List<AccountBookCategorySummaryRes>> getCategorySummary(
            @CurrentUserEmail String email,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {
        return DataResponse.of(accountBookService.getTotalAmountByCategory(email, startDate, endDate));
    }

}
