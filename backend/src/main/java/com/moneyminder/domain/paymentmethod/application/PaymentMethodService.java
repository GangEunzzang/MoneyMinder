package com.moneyminder.domain.paymentmethod.application;

import com.moneyminder.domain.paymentmethod.application.dto.request.PaymentMethodServiceCreateReq;
import com.moneyminder.domain.paymentmethod.application.dto.request.PaymentMethodServiceUpdateReq;
import com.moneyminder.domain.paymentmethod.application.dto.response.PaymentMethodServiceRes;
import com.moneyminder.domain.paymentmethod.domain.PaymentMethod;
import com.moneyminder.domain.paymentmethod.domain.repository.PaymentMethodRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;

    @Transactional
    public PaymentMethodServiceRes create(PaymentMethodServiceCreateReq request) {
        PaymentMethod paymentMethod = paymentMethodRepository.save(request.toDomain(nextSortOrder(request.userEmail())));

        return PaymentMethodServiceRes.fromDomain(paymentMethod);
    }

    @Transactional
    public PaymentMethodServiceRes update(PaymentMethodServiceUpdateReq request) {
        PaymentMethod paymentMethod = paymentMethodRepository.getById(request.paymentMethodId());

        paymentMethod.validateOwner(request.userEmail());
        paymentMethod.update(request.name(), request.kind(), request.color(), request.billingDay());

        paymentMethodRepository.save(paymentMethod);

        return PaymentMethodServiceRes.fromDomain(paymentMethod);
    }

    @Transactional
    public void delete(Long paymentMethodId, String email) {
        PaymentMethod paymentMethod = paymentMethodRepository.getById(paymentMethodId);

        paymentMethod.validateOwner(email);

        paymentMethodRepository.delete(paymentMethod);
    }

    @Transactional(readOnly = true)
    public List<PaymentMethodServiceRes> getByUserEmail(String email) {
        return paymentMethodRepository.findByUserEmail(email).stream()
                .map(PaymentMethodServiceRes::fromDomain)
                .toList();
    }

    @Transactional(readOnly = true)
    public PaymentMethodServiceRes getById(Long paymentMethodId, String email) {
        PaymentMethod paymentMethod = paymentMethodRepository.getById(paymentMethodId);

        paymentMethod.validateOwner(email);

        return PaymentMethodServiceRes.fromDomain(paymentMethod);
    }

    /**
     * 새 수단은 목록 맨 뒤에 붙는다. 순서를 클라이언트가 정해 보내면 동시 등록 때 값이 겹친다.
     */
    private int nextSortOrder(String email) {
        return paymentMethodRepository.findByUserEmail(email).stream()
                .mapToInt(PaymentMethod::getSortOrder)
                .max()
                .orElse(-1) + 1;
    }
}
