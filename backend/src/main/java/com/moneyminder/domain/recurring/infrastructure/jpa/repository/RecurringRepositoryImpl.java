package com.moneyminder.domain.recurring.infrastructure.jpa.repository;

import com.moneyminder.domain.recurring.domain.Recurring;
import com.moneyminder.domain.recurring.domain.repository.RecurringRepository;
import com.moneyminder.domain.recurring.infrastructure.jpa.entity.RecurringEntity;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class RecurringRepositoryImpl implements RecurringRepository {

    private final RecurringJpaRepository jpaRepository;

    @Override
    public Recurring save(Recurring recurring) {
        return jpaRepository.save(RecurringEntity.from(recurring)).toDomain();
    }

    @Override
    public void delete(Recurring recurring) {
        jpaRepository.delete(RecurringEntity.from(recurring));
    }

    @Override
    public void deleteAllInBatch() {
        jpaRepository.deleteAllInBatch();
    }

    @Override
    public Recurring getById(Long id) {
        return findById(id).orElseThrow(() -> new BaseException(ResultCode.RECURRING_NOT_FOUND));
    }

    @Override
    public Optional<Recurring> findById(Long id) {
        return jpaRepository.findById(id).map(RecurringEntity::toDomain);
    }

    @Override
    public List<Recurring> findByUserEmail(String email) {
        return jpaRepository.findByUserEmailOrderByCycleDayAscIdAsc(email).stream()
                .map(RecurringEntity::toDomain)
                .toList();
    }
}
