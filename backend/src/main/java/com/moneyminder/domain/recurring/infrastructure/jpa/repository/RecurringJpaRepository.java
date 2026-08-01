package com.moneyminder.domain.recurring.infrastructure.jpa.repository;

import com.moneyminder.domain.recurring.infrastructure.jpa.entity.RecurringEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecurringJpaRepository extends JpaRepository<RecurringEntity, Long> {

    List<RecurringEntity> findByUserEmailOrderByCycleDayAscIdAsc(String userEmail);
}
