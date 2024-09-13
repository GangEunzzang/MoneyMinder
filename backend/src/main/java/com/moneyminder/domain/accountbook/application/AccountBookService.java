package com.moneyminder.domain.accountbook.application;

import com.moneyminder.domain.accountbook.application.dto.request.AccountBookMonthSummaryReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceCreateReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceUpdateReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookWeekSummaryReq;
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
import com.moneyminder.global.util.TimeUtils;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        Map<Integer, AccountBookMonthSummaryRes.WeekSummary> map = new HashMap<>();
        BigInteger monthTotalIncome = BigInteger.ZERO;
        BigInteger monthTotalExpense = BigInteger.ZERO;

        int totalWeek = TimeUtils.getWeekOfMonth(year, month);

        for (int i = 1; i <= totalWeek; i++) {
            LocalDate[] firstAndLastDayOfWeek = TimeUtils.getFirstAndLastDayOfWeek(year, month, i);

            AccountBookWeekSummaryReq incomeRequest = AccountBookWeekSummaryReq.from(firstAndLastDayOfWeek[0],
                    firstAndLastDayOfWeek[1], CategoryType.INCOME);
            AccountBookWeekSummaryReq expenseRequest = AccountBookWeekSummaryReq.from(firstAndLastDayOfWeek[0],
                    firstAndLastDayOfWeek[1], CategoryType.EXPENSE);

            BigInteger weekTotalIncome = accountBookRepository.findWeekTotalByCategoryType(email, incomeRequest);
            BigInteger weekTotalExpense = accountBookRepository.findWeekTotalByCategoryType(email, expenseRequest);

            map.put(i, AccountBookMonthSummaryRes.WeekSummary.from(weekTotalIncome, weekTotalExpense));
            monthTotalIncome = monthTotalIncome.add(weekTotalIncome);
            monthTotalExpense = monthTotalExpense.add(weekTotalExpense);
        }

        return AccountBookMonthSummaryRes.builder()
                .year(year)
                .month(month)
                .monthTotalIncome(monthTotalIncome)
                .monthTotalExpense(monthTotalExpense)
                .weeklySummary(map)
                .build();
    }

    @Transactional(readOnly = true)
    public AccountBookYearSummaryRes getYearSummary(String email, Integer year) {
        Map<Integer, AccountBookYearSummaryRes.MonthSummary> map = new HashMap<>();
        BigInteger yearTotalIncome = BigInteger.ZERO;
        BigInteger yearTotalExpense = BigInteger.ZERO;

        for (int i = 1; i <= 12; i++) {
            AccountBookMonthSummaryReq incomeRequest = AccountBookMonthSummaryReq.from(year, i, CategoryType.INCOME);
            AccountBookMonthSummaryReq expenseRequest = AccountBookMonthSummaryReq.from(year, i, CategoryType.EXPENSE);

            BigInteger monthTotalIncome = accountBookRepository.findMonthTotalByCategory(email, incomeRequest);
            BigInteger monthTotalExpense = accountBookRepository.findMonthTotalByCategory(email, expenseRequest);

            map.put(i, AccountBookYearSummaryRes.MonthSummary.from(monthTotalIncome, monthTotalExpense));
            yearTotalIncome = yearTotalIncome.add(monthTotalIncome);
            yearTotalExpense = yearTotalExpense.add(monthTotalExpense);
        }

        return AccountBookYearSummaryRes.builder()
                .year(year)
                .yearTotalIncome(yearTotalIncome)
                .yearTotalExpense(yearTotalExpense)
                .monthlySummary(map)
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