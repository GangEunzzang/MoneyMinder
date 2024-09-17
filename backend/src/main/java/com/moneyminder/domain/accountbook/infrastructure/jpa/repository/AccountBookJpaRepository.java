package com.moneyminder.domain.accountbook.infrastructure.jpa.repository;

import com.moneyminder.domain.accountbook.infrastructure.jpa.entity.AccountBookEntity;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountBookJpaRepository extends JpaRepository<AccountBookEntity, Long>, AccountBookQueryRepository {

    List<AccountBookEntity> findByUserEmailAndTransactionDateGreaterThanEqualAndTransactionDateLessThanEqual(
            String email, LocalDate startDate, LocalDate endDate);
}