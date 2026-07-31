package com.moneyminder.domain.paymentmethod.presentation;

import com.moneyminder.domain.paymentmethod.application.PaymentMethodService;
import com.moneyminder.domain.paymentmethod.application.dto.response.PaymentMethodServiceRes;
import com.moneyminder.domain.paymentmethod.presentation.dto.PaymentMethodCreateReq;
import com.moneyminder.domain.paymentmethod.presentation.dto.PaymentMethodUpdateReq;
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
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/payment-methods")
@RestController
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    @PostMapping
    public DataResponse<PaymentMethodServiceRes> create(@CurrentUserEmail String email,
            @Valid @RequestBody PaymentMethodCreateReq request) {
        return DataResponse.of(paymentMethodService.create(request.toService(email)));
    }

    @PutMapping("/{paymentMethodId}")
    public DataResponse<PaymentMethodServiceRes> update(@CurrentUserEmail String email,
            @PathVariable Long paymentMethodId, @Valid @RequestBody PaymentMethodUpdateReq request) {
        return DataResponse.of(paymentMethodService.update(request.toService(paymentMethodId, email)));
    }

    @DeleteMapping("/{paymentMethodId}")
    public DataResponse<Void> delete(@CurrentUserEmail String email, @PathVariable Long paymentMethodId) {
        paymentMethodService.delete(paymentMethodId, email);

        return DataResponse.empty();
    }

    @GetMapping("/{paymentMethodId}")
    public DataResponse<PaymentMethodServiceRes> getById(@CurrentUserEmail String email,
            @PathVariable Long paymentMethodId) {
        return DataResponse.of(paymentMethodService.getById(paymentMethodId, email));
    }

    @GetMapping
    public DataResponse<List<PaymentMethodServiceRes>> getMine(@CurrentUserEmail String email) {
        return DataResponse.of(paymentMethodService.getByUserEmail(email));
    }
}
