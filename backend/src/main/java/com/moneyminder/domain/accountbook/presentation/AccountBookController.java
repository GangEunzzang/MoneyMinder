package com.moneyminder.domain.accountbook.presentation;

import com.moneyminder.domain.accountbook.application.AccountBookService;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookCategorySummaryRes;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookDefaultRes;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookMonthSummaryRes;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookYearSummaryRes;
import com.moneyminder.domain.accountbook.presentation.dto.AccountBookCreateReq;
import com.moneyminder.domain.accountbook.presentation.dto.AccountBookUpdateReq;
import com.moneyminder.global.annotation.CurrentUserEmail;
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
@RequestMapping("/api/v1/account-books")
@RestController
public class AccountBookController {

    private final AccountBookService accountBookService;

    @PostMapping
    public DataResponse<AccountBookDefaultRes> create(@CurrentUserEmail String email,
            @Valid @RequestBody AccountBookCreateReq request) {
        return DataResponse.of(accountBookService.create(request.toService(email)));
    }

    @PutMapping("/{accountId}")
    public DataResponse<AccountBookDefaultRes> update(@CurrentUserEmail String email, @PathVariable Long accountId,
            @Valid @RequestBody AccountBookUpdateReq request) {
        return DataResponse.of(accountBookService.update(request.toService(accountId, email)));
    }

    @DeleteMapping("/{accountId}")
    public DataResponse<Void> delete(@CurrentUserEmail String email, @PathVariable Long accountId) {
        accountBookService.delete(accountId, email);

        return DataResponse.empty();
    }

    @GetMapping("/{accountId}")
    public DataResponse<AccountBookDefaultRes> getById(@PathVariable Long accountId) {
        return DataResponse.of(accountBookService.getById(accountId));
    }

    /**
     * 내 거래 목록. 이메일은 경로가 아니라 토큰에서 온다.
     */
    @GetMapping
    public DataResponse<List<AccountBookDefaultRes>> getMine(
            @CurrentUserEmail String email,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String memo
    ) {
        AccountBookServiceSearchReq searchReq = AccountBookServiceSearchReq.from(categoryCode, startDate, endDate, memo,
                cursorId);

        return DataResponse.of(accountBookService.getByUserEmailAndSearch(email, searchReq));
    }

    @GetMapping("/summaries/yearly")
    public DataResponse<AccountBookYearSummaryRes> getYearlySummary(@CurrentUserEmail String email,
            @RequestParam Integer year) {
        return DataResponse.of(accountBookService.getYearSummary(email, year));
    }

    @GetMapping("/summaries/monthly")
    public DataResponse<AccountBookMonthSummaryRes> getMonthlySummary(@CurrentUserEmail String email,
            @RequestParam Integer year, @RequestParam Integer month) {
        return DataResponse.of(accountBookService.getMonthSummary(email, year, month));
    }

    @GetMapping("/summaries/categories")
    public DataResponse<List<AccountBookCategorySummaryRes>> getCategorySummary(@CurrentUserEmail String email,
            @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        return DataResponse.of(accountBookService.getTotalAmountByCategory(email, startDate, endDate));
    }
}
