package com.moneyminder.domain.paymentmethod.domain.repository;

import com.moneyminder.domain.paymentmethod.domain.PaymentMethod;
import java.util.List;
import java.util.Optional;

public interface PaymentMethodRepository {

    PaymentMethod save(PaymentMethod paymentMethod);

    void delete(PaymentMethod paymentMethod);

    void deleteAllInBatch();

    PaymentMethod getById(Long id);

    Optional<PaymentMethod> findById(Long id);

    List<PaymentMethod> findByUserEmail(String email);

    boolean existsByIdAndUserEmail(Long id, String email);
}
