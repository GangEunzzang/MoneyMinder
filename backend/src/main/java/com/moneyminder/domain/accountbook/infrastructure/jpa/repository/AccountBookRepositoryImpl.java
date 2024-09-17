package com.moneyminder.domain.accountbook.infrastructure.jpa.repository;

import com.moneyminder.domain.accountbook.application.dto.request.AccountBookMonthSummaryReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookWeekSummaryReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookDefaultRes;
import com.moneyminder.domain.accountbook.domain.AccountBook;
import com.moneyminder.domain.accountbook.domain.repository.AccountBookRepository;
import com.moneyminder.domain.accountbook.infrastructure.jpa.entity.AccountBookEntity;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import java.math.BigInteger;
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
        return jpaRepository.save(accountBook.toEntity()).toDomain();
    }

    @Override
    public void delete(AccountBook accountBook) {
        jpaRepository.delete(accountBook.toEntity());
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
    public Optional<AccountBookDefaultRes> findWithCategoryById(Long id) {
        return Optional.ofNullable(jpaRepository.findWithCategoryById(id));
    }

    @Override
    public List<AccountBookDefaultRes> findWithCategoryByEmail(String email) {
        return jpaRepository.findWithCategoryByEmail(email);
    }

    @Override
    public List<AccountBookDefaultRes> findWithCategoryByEmailAndSearch(String email, AccountBookServiceSearchReq searchReq) {
        return jpaRepository.findWithCategoryByEmailAndSearch(email, searchReq);
    }

    @Override
    public BigInteger findWeekTotalByCategoryType(String email, AccountBookWeekSummaryReq request) {
        return jpaRepository.findWeekTotalByCategoryType(email, request);
    }

    @Override
    public BigInteger findMonthTotalByCategory(String email, AccountBookMonthSummaryReq request) {
        return jpaRepository.findMonthTotalByCategoryType(email, request);
    }

    @Override
    public List<AccountBook> findWithCategoryByDate(String email, LocalDate startDate, LocalDate endDate) {
        return jpaRepository.findByUserEmailAndTransactionDateGreaterThanEqualAndTransactionDateLessThanEqual(email,
                        startDate, endDate).stream()
                .map(AccountBookEntity::toDomain)
                .toList();
    }


}