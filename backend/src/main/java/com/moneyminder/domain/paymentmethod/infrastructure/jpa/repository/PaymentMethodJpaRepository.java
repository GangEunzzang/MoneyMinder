package com.moneyminder.domain.paymentmethod.infrastructure.jpa.repository;

import com.moneyminder.domain.paymentmethod.infrastructure.jpa.entity.PaymentMethodEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentMethodJpaRepository extends JpaRepository<PaymentMethodEntity, Long> {

    List<PaymentMethodEntity> findByUserEmailOrderBySortOrderAscIdAsc(String userEmail);

    boolean existsByIdAndUserEmail(Long id, String userEmail);
}
