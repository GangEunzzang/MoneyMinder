package com.moneyminder.domain.accountbook.infrastructure.jpa.repository;

import com.moneyminder.domain.accountbook.domain.AccountBook;
import com.moneyminder.domain.accountbook.domain.AccountBookSearchCond;
import com.moneyminder.domain.accountbook.domain.AccountBookWithCategory;
import com.moneyminder.domain.accountbook.domain.AmountByDate;
import com.moneyminder.domain.accountbook.domain.AmountByMonth;
import com.moneyminder.domain.accountbook.domain.repository.AccountBookRepository;
import com.moneyminder.domain.accountbook.infrastructure.jpa.entity.AccountBookEntity;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class AccountBookRepositoryImpl implements AccountBookRepository {

    private final AccountBookJpaRepository jpaRepository;

    @Override
    public AccountBook save(AccountBook accountBook) {
        return jpaRepository.save(AccountBookEntity.from(accountBook)).toDomain();
    }

    @Override
    public void delete(AccountBook accountBook) {
        jpaRepository.delete(AccountBookEntity.from(accountBook));
    }

    @Override
    public void deleteAllInBatch() {
        jpaRepository.deleteAllInBatch();
    }

    @Override
    public AccountBook getById(Long id) {
        return findById(id).orElseThrow(() -> new BaseException(ResultCode.ACCOUNT_BOOK_NOT_FOUND));
    }

    @Override
    public Optional<AccountBook> findById(Long id) {
        return jpaRepository.findById(id)
                .map(AccountBookEntity::toDomain);
    }

    @Override
    public Optional<AccountBookWithCategory> findWithCategoryById(Long id) {
        return Optional.ofNullable(jpaRepository.findWithCategoryById(id));
    }

    @Override
    public List<AccountBookWithCategory> findWithCategoryByEmail(String email) {
        return jpaRepository.findWithCategoryByEmail(email);
    }

    @Override
    public List<AccountBookWithCategory> findWithCategoryByEmailAndSearch(String email, AccountBookSearchCond cond) {
        return jpaRepository.findWithCategoryByEmailAndSearch(email, cond);
    }

    @Override
    public List<AccountBookWithCategory> findWithCategoryByDate(String email, LocalDate startDate, LocalDate endDate) {
        return jpaRepository.findWithCategoryByDate(email, startDate, endDate);
    }

    @Override
    public List<AmountByMonth> findMonthlyTotals(String email, int year) {
        return jpaRepository.findMonthlyTotals(email, year);
    }

    @Override
    public List<AmountByDate> findDailyTotals(String email, LocalDate startDate, LocalDate endDate) {
        return jpaRepository.findDailyTotals(email, startDate, endDate);
    }
}
