package com.moneyminder.accountbook.infrastructure.jpa.repository;

import com.moneyminder.domain.accountbook.infrastructure.jpa.entity.AccountBookEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AccountBookJpaRepository extends JpaRepository<AccountBookEntity, Long>, AccountBookQueryRepository {

    List<AccountBookEntity> findByUserEmailAndTransactionDateGreaterThanEqualAndTransactionDateLessThanEqual(
            String email, LocalDate startDate, LocalDate endDate);
}
