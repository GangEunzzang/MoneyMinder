package com.moneyminder.domain.accountbook.presentation;

import com.moneyminder.domain.accountbook.application.AccountBookService;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceCreateReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceUpdateReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookServiceRes;
import com.moneyminder.domain.accountbook.presentation.dto.AccountBookCreateReq;
import com.moneyminder.domain.accountbook.presentation.dto.AccountBookUpdateReq;
import com.moneyminder.global.annotaion.CurrentUserEmail;
import com.moneyminder.global.response.APIResponse;
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
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/accountBook")
@RestController
public class AccountBookController {

    private final AccountBookService accountBookService;

    @PostMapping("/create")
    public DataResponse<AccountBookServiceRes> create(@CurrentUserEmail String email, @Valid @RequestBody AccountBookCreateReq request) {
        AccountBookServiceCreateReq serviceRequest = request.toService(email);
        AccountBookServiceRes response = accountBookService.create(serviceRequest);
        return DataResponse.of(response);
    }

    @PutMapping("/update")
    public DataResponse<AccountBookServiceRes> update(@CurrentUserEmail String email, @Valid @RequestBody AccountBookUpdateReq request) {
        AccountBookServiceUpdateReq serviceRequest = request.toService(email);
        AccountBookServiceRes response = accountBookService.update(serviceRequest);
        return DataResponse.of(response);
    }

    @DeleteMapping("/delete/{accountId}")
    public APIResponse delete(@CurrentUserEmail String email, @PathVariable Long accountId) {
        accountBookService.delete(accountId, email);

        return DataResponse.empty();
    }

    @GetMapping("/id/{accountId}")
    public DataResponse<AccountBookServiceRes> findByAccountId(@PathVariable Long accountId) {
        AccountBookServiceRes response = accountBookService.getById(accountId);
        return DataResponse.of(response);
    }

    @GetMapping("/email")
    public DataResponse<List<AccountBookServiceRes>> findByUserEmail(@CurrentUserEmail String email) {
        List<AccountBookServiceRes> response = accountBookService.getByUserEmail(email);
        return DataResponse.of(response);
    }


}