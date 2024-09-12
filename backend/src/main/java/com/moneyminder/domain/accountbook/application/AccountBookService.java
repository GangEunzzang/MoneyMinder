package com.moneyminder.domain.accountbook.application;

import com.moneyminder.domain.accountbook.application.dto.request.AccountBookMonthSummaryReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceCreateReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceUpdateReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookDefaultRes;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookMonthSummaryRes;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookYearSummaryRes;
import com.moneyminder.domain.accountbook.domain.AccountBook;
import com.moneyminder.domain.accountbook.domain.repository.AccountBookRepository;
import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.repository.CategoryRepository;
import com.moneyminder.domain.category.domain.type.CategoryType;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class AccountBookService {

    private final AccountBookRepository accountBookRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public AccountBookDefaultRes create(AccountBookServiceCreateReq createRequest) {
        validateCategoryCode(createRequest.categoryCode());
        AccountBook accountBook = accountBookRepository.save(createRequest.toDomain());
        return mapToServiceResponse(accountBook);
    }

    @Transactional
    public AccountBookDefaultRes update(AccountBookServiceUpdateReq updateRequest) {
        validateCategoryCode(updateRequest.categoryCode());

        AccountBook currentAccountBook = accountBookRepository.getById(updateRequest.accountId());

        validateUserEmail(currentAccountBook.userEmail(), updateRequest.userEmail());

        AccountBook updatedAccountBook = currentAccountBook.update(updateRequest.toDomain());
        accountBookRepository.save(updatedAccountBook);

        return mapToServiceResponse(updatedAccountBook);
    }

    @Transactional
    public void delete(Long accountId, String email) {
        AccountBook accountBook = accountBookRepository.getById(accountId);

        validateUserEmail(accountBook.userEmail(), email);

        accountBookRepository.delete(accountBook);
    }

    public AccountBookDefaultRes getById(Long accountId) {
        return accountBookRepository.findWithCategoryById(accountId)
                .orElseThrow(() -> new BaseException(ResultCode.ACCOUNT_BOOK_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public List<AccountBookDefaultRes> getByUserEmail(String email) {
        return accountBookRepository.findWithCategoryByEmail(email);
    }

    @Transactional(readOnly = true)
    public List<AccountBookDefaultRes> getByUserEmailAndSearch(String email, AccountBookServiceSearchReq searchReq) {
        return accountBookRepository.findWithCategoryByEmailAndSearch(email, searchReq);
    }

    @Transactional(readOnly = true)
    public AccountBookMonthSummaryRes getMonthSummary(String email, Integer year, Integer month) {
        AccountBookMonthSummaryReq incomeRequest = AccountBookMonthSummaryReq.from(year, month, CategoryType.INCOME);
        BigInteger totalIncome = accountBookRepository.findMonthlyTotalByCategory(email, incomeRequest);

        AccountBookMonthSummaryReq expenseRequest = AccountBookMonthSummaryReq.from(year, month, CategoryType.EXPENSE);
        BigInteger totalExpense = accountBookRepository.findMonthlyTotalByCategory(email, expenseRequest);

        return AccountBookMonthSummaryRes.builder()
                .year(year)
                .month(month)
                .monthTotalIncome(totalIncome)
                .monthTotalExpense(totalExpense)
                .build();
    }

    @Transactional(readOnly = true)
    public AccountBookYearSummaryRes getYearSummary(String email, Integer year) {
        Map<Integer, AccountBookYearSummaryRes.MonthSummary> monthlyTotal = new HashMap<>();

        BigInteger yearTotalIncome = BigInteger.ZERO;
        BigInteger yearTotalExpense = BigInteger.ZERO;

        for (int month = 1; month <= 12; month++) {
            AccountBookMonthSummaryRes monthTotal = getMonthSummary(email, year, month);

            monthlyTotal.put(month, AccountBookYearSummaryRes.MonthSummary.from(
                    monthTotal.monthTotalIncome(),
                    monthTotal.monthTotalExpense())
            );

            yearTotalIncome = yearTotalIncome.add(monthTotal.monthTotalIncome());
            yearTotalExpense = yearTotalExpense.add(monthTotal.monthTotalExpense());
        }

        return AccountBookYearSummaryRes.builder()
                .year(year)
                .yearTotalIncome(yearTotalIncome)
                .yearTotalExpense(yearTotalExpense)
                .monthlyTotal(monthlyTotal)
                .build();
    }


    private AccountBookDefaultRes mapToServiceResponse(AccountBook accountBook) {
        Category category = categoryRepository.findByCategoryCode(accountBook.categoryCode())
                .orElseGet(Category::defaultCategory);

        return AccountBookDefaultRes.fromDomain(accountBook, category);
    }

    private void validateCategoryCode(String categoryCode) {
        if (!categoryRepository.existsByCategoryCode(categoryCode)) {
            throw new BaseException(ResultCode.CATEGORY_NOT_FOUND);
        }
    }

    private void validateUserEmail(String currentEmail, String updateEmail) {
        if (!currentEmail.equals(updateEmail)) {
            throw new BaseException(ResultCode.ACCOUNT_BOOK_FORBIDDEN);
        }
    }
}