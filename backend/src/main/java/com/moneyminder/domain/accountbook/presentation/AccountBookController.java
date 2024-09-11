package com.moneyminder.domain.accountbook.presentation;

import com.moneyminder.domain.accountbook.application.AccountBookService;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceCreateReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceUpdateReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookServiceDefaultRes;
import com.moneyminder.domain.accountbook.presentation.dto.AccountBookCreateReq;
import com.moneyminder.domain.accountbook.presentation.dto.AccountBookUpdateReq;
import com.moneyminder.global.annotaion.CurrentUserEmail;
import com.moneyminder.global.response.APIResponse;
import com.moneyminder.global.response.DataResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/accountBook")
@RestController
public class AccountBookController {

    private final AccountBookService accountBookService;

    @PostMapping("/create")
    public DataResponse<AccountBookServiceDefaultRes> create(@CurrentUserEmail String email,
                                                             @Valid @RequestBody AccountBookCreateReq request) {
        AccountBookServiceCreateReq serviceRequest = request.toService(email);
        AccountBookServiceDefaultRes response = accountBookService.create(serviceRequest);
        return DataResponse.of(response);
    }

    @PutMapping("/update")
    public DataResponse<AccountBookServiceDefaultRes> update(@CurrentUserEmail String email,
                                                             @Valid @RequestBody AccountBookUpdateReq request) {
        AccountBookServiceUpdateReq serviceRequest = request.toService(email);
        AccountBookServiceDefaultRes response = accountBookService.update(serviceRequest);
        return DataResponse.of(response);
    }

    @DeleteMapping("/delete/{accountId}")
    public APIResponse delete(@CurrentUserEmail String email, @PathVariable Long accountId) {
        accountBookService.delete(accountId, email);

        return DataResponse.empty();
    }

    @GetMapping("/id/{accountId}")
    public DataResponse<AccountBookServiceDefaultRes> findByAccountId(@PathVariable Long accountId) {
        AccountBookServiceDefaultRes response = accountBookService.getById(accountId);
        return DataResponse.of(response);
    }

    @GetMapping("/email")
    public DataResponse<List<AccountBookServiceDefaultRes>> findByUserEmail(@CurrentUserEmail String email) {
        List<AccountBookServiceDefaultRes> response = accountBookService.getByUserEmail(email);
        return DataResponse.of(response);
    }

    @GetMapping("/search")
    public DataResponse<List<AccountBookServiceDefaultRes>> findBySearch(
            @CurrentUserEmail String email,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String memo
    ) {
        AccountBookServiceSearchReq searchReq = AccountBookServiceSearchReq.from(categoryCode, startDate, endDate, memo, cursorId);

        List<AccountBookServiceDefaultRes> response = accountBookService.getByUserEmailAndSearch(email, searchReq);
        return DataResponse.of(response);
    }

    @GetMapping("/expenses/summary")
    public DataResponse<>

}
