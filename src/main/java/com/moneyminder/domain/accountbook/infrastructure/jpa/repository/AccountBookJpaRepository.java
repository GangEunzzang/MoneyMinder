package com.moneyminder.domain.accountbook.infrastructure.jpa.repository;

import com.moneyminder.domain.accountbook.infrastructure.jpa.entity.AccountBookEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountBookJpaRepository extends JpaRepository<AccountBookEntity, Long>, AccountBookQueryRepository {

}