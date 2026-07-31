package com.moneyminder.domain.paymentmethod.infrastructure.jpa.repository;

import com.moneyminder.domain.paymentmethod.domain.PaymentMethod;
import com.moneyminder.domain.paymentmethod.domain.repository.PaymentMethodRepository;
import com.moneyminder.domain.paymentmethod.infrastructure.jpa.entity.PaymentMethodEntity;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class PaymentMethodRepositoryImpl implements PaymentMethodRepository {

    private final PaymentMethodJpaRepository jpaRepository;

    @Override
    public PaymentMethod save(PaymentMethod paymentMethod) {
        return jpaRepository.save(PaymentMethodEntity.from(paymentMethod)).toDomain();
    }

    @Override
    public void delete(PaymentMethod paymentMethod) {
        jpaRepository.delete(PaymentMethodEntity.from(paymentMethod));
    }

    @Override
    public void deleteAllInBatch() {
        jpaRepository.deleteAllInBatch();
    }

    @Override
    public PaymentMethod getById(Long id) {
        return findById(id).orElseThrow(() -> new BaseException(ResultCode.PAYMENT_METHOD_NOT_FOUND));
    }

    @Override
    public Optional<PaymentMethod> findById(Long id) {
        return jpaRepository.findById(id).map(PaymentMethodEntity::toDomain);
    }

    @Override
    public List<PaymentMethod> findByUserEmail(String email) {
        return jpaRepository.findByUserEmailOrderBySortOrderAscIdAsc(email).stream()
                .map(PaymentMethodEntity::toDomain)
                .toList();
    }

    @Override
    public boolean existsByIdAndUserEmail(Long id, String email) {
        return jpaRepository.existsByIdAndUserEmail(id, email);
    }
}
