package com.moneyminder.domain.recurring.domain.repository;

import com.moneyminder.domain.recurring.domain.Recurring;
import java.util.List;
import java.util.Optional;

public interface RecurringRepository {

    Recurring save(Recurring recurring);

    void delete(Recurring recurring);

    void deleteAllInBatch();

    Recurring getById(Long id);

    Optional<Recurring> findById(Long id);

    List<Recurring> findByUserEmail(String email);
}
