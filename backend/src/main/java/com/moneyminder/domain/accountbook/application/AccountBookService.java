package com.moneyminder.domain.accountbook.application;

import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceCreateReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceUpdateReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookCategorySummaryRes;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookDefaultRes;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookMonthSummaryRes;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookYearSummaryRes;
import com.moneyminder.domain.accountbook.domain.AccountBook;
import com.moneyminder.domain.accountbook.domain.AccountBookWithCategory;
import com.moneyminder.domain.accountbook.domain.AmountByDate;
import com.moneyminder.domain.accountbook.domain.AmountByMonth;
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
import java.util.LinkedHashMap;
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

        AccountBook accountBook = accountBookRepository.getById(updateRequest.accountId());

        accountBook.validateOwner(updateRequest.userEmail());
        accountBook.update(updateRequest.categoryCode(), updateRequest.amount(), updateRequest.transactionDate(),
                updateRequest.memo(), updateRequest.paymentMethodId(), updateRequest.merchant());

        accountBookRepository.save(accountBook);

        return mapToServiceResponse(accountBook);
    }

    @Transactional
    public void delete(Long accountId, String email) {
        AccountBook accountBook = accountBookRepository.getById(accountId);

        accountBook.validateOwner(email);

        accountBookRepository.delete(accountBook);
    }

    @Transactional(readOnly = true)
    public AccountBookDefaultRes getById(Long accountId) {
        return accountBookRepository.findWithCategoryById(accountId)
                .map(AccountBookDefaultRes::from)
                .orElseThrow(() -> new BaseException(ResultCode.ACCOUNT_BOOK_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public List<AccountBookDefaultRes> getByUserEmail(String email) {
        return accountBookRepository.findWithCategoryByEmail(email).stream()
                .map(AccountBookDefaultRes::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AccountBookDefaultRes> getByUserEmailAndSearch(String email, AccountBookServiceSearchReq searchReq) {
        return accountBookRepository.findWithCategoryByEmailAndSearch(email, searchReq.toCond()).stream()
                .map(AccountBookDefaultRes::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AccountBookMonthSummaryRes getMonthSummary(String email, Integer year, Integer month) {
        LocalDate firstDayOfMonth = LocalDate.of(year, month, 1);
        LocalDate lastDayOfMonth = firstDayOfMonth.withDayOfMonth(firstDayOfMonth.lengthOfMonth());

        List<AmountByDate> dailyTotals = accountBookRepository.findDailyTotals(email, firstDayOfMonth, lastDayOfMonth);

        Map<Integer, AccountBookMonthSummaryRes.WeekSummary> weeklySummary = new HashMap<>();
        BigInteger monthTotalIncome = BigInteger.ZERO;
        BigInteger monthTotalExpense = BigInteger.ZERO;

        int totalWeek = TimeUtils.getWeekOfMonth(year, month);

        for (int week = 1; week <= totalWeek; week++) {
            LocalDate[] firstAndLastDayOfWeek = TimeUtils.getFirstAndLastDayOfWeek(year, month, week);

            BigInteger weekTotalIncome = sumBetween(dailyTotals, firstAndLastDayOfWeek[0], firstAndLastDayOfWeek[1],
                    CategoryType.INCOME);
            BigInteger weekTotalExpense = sumBetween(dailyTotals, firstAndLastDayOfWeek[0], firstAndLastDayOfWeek[1],
                    CategoryType.EXPENSE);

            weeklySummary.put(week, AccountBookMonthSummaryRes.WeekSummary.from(weekTotalIncome, weekTotalExpense));
            monthTotalIncome = monthTotalIncome.add(weekTotalIncome);
            monthTotalExpense = monthTotalExpense.add(weekTotalExpense);
        }

        return AccountBookMonthSummaryRes.builder()
                .year(year)
                .month(month)
                .monthTotalIncome(monthTotalIncome)
                .monthTotalExpense(monthTotalExpense)
                .weeklySummary(weeklySummary)
                .build();
    }

    @Transactional(readOnly = true)
    public AccountBookYearSummaryRes getYearSummary(String email, Integer year) {
        List<AmountByMonth> monthlyTotals = accountBookRepository.findMonthlyTotals(email, year);

        Map<Integer, AccountBookYearSummaryRes.MonthSummary> monthlySummary = new HashMap<>();
        BigInteger yearTotalIncome = BigInteger.ZERO;
        BigInteger yearTotalExpense = BigInteger.ZERO;

        for (int month = 1; month <= 12; month++) {
            BigInteger monthTotalIncome = totalOfMonth(monthlyTotals, month, CategoryType.INCOME);
            BigInteger monthTotalExpense = totalOfMonth(monthlyTotals, month, CategoryType.EXPENSE);

            monthlySummary.put(month,
                    AccountBookYearSummaryRes.MonthSummary.from(monthTotalIncome, monthTotalExpense));
            yearTotalIncome = yearTotalIncome.add(monthTotalIncome);
            yearTotalExpense = yearTotalExpense.add(monthTotalExpense);
        }

        return AccountBookYearSummaryRes.builder()
                .year(year)
                .yearTotalIncome(yearTotalIncome)
                .yearTotalExpense(yearTotalExpense)
                .monthlySummary(monthlySummary)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AccountBookCategorySummaryRes> getTotalAmountByCategory(String email, LocalDate startDate,
            LocalDate endDate) {
        Map<String, AccountBookCategorySummaryRes> summaryByCategoryCode = new LinkedHashMap<>();

        for (AccountBookWithCategory row : accountBookRepository.findWithCategoryByDate(email, startDate, endDate)) {
            String categoryCode = row.categoryCode() == null ? Category.DEFAULT_CATEGORY_CODE : row.categoryCode();
            String categoryName = row.categoryName() == null ? Category.DEFAULT_CATEGORY_NAME : row.categoryName();

            summaryByCategoryCode.merge(categoryCode,
                    AccountBookCategorySummaryRes.from(categoryName, categoryCode, row.amount()),
                    (accumulated, added) -> AccountBookCategorySummaryRes.from(
                            accumulated.categoryName(),
                            accumulated.categoryCode(),
                            accumulated.totalSpentAmount().add(added.totalSpentAmount())));
        }

        return List.copyOf(summaryByCategoryCode.values());
    }

    private BigInteger sumBetween(List<AmountByDate> dailyTotals, LocalDate startDate, LocalDate endDate,
            CategoryType categoryType) {
        return dailyTotals.stream()
                .filter(daily -> categoryType.equals(daily.categoryType()))
                .filter(daily -> !daily.transactionDate().isBefore(startDate)
                        && !daily.transactionDate().isAfter(endDate))
                .map(AmountByDate::total)
                .reduce(BigInteger.ZERO, BigInteger::add);
    }

    private BigInteger totalOfMonth(List<AmountByMonth> monthlyTotals, int month, CategoryType categoryType) {
        return monthlyTotals.stream()
                .filter(monthly -> monthly.month() != null && monthly.month() == month)
                .filter(monthly -> categoryType.equals(monthly.categoryType()))
                .map(AmountByMonth::total)
                .reduce(BigInteger.ZERO, BigInteger::add);
    }

    private AccountBookDefaultRes mapToServiceResponse(AccountBook accountBook) {
        Category category = categoryRepository.findByCategoryCode(accountBook.getCategoryCode())
                .orElseGet(Category::defaultCategory);

        return AccountBookDefaultRes.fromDomain(accountBook, category);
    }

    private void validateCategoryCode(String categoryCode) {
        if (!categoryRepository.existsByCategoryCode(categoryCode)) {
            throw new BaseException(ResultCode.CATEGORY_NOT_FOUND);
        }
    }
}
