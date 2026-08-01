package com.moneyminder.domain.accountbook.infrastructure.jpa.repository;

import com.moneyminder.domain.accountbook.domain.AccountBookSearchCond;
import com.moneyminder.domain.accountbook.domain.AccountBookWithCategory;
import com.moneyminder.domain.accountbook.domain.AmountByDate;
import com.moneyminder.domain.accountbook.domain.AmountByMonth;
import java.time.LocalDate;
import java.util.List;

public interface AccountBookQueryRepository {

    AccountBookWithCategory findWithCategoryById(Long id);

    List<AccountBookWithCategory> findWithCategoryByEmail(String email);

    List<AccountBookWithCategory> findWithCategoryByEmailAndSearch(String email, AccountBookSearchCond cond);

    List<AccountBookWithCategory> findWithCategoryByDate(String email, LocalDate startDate, LocalDate endDate);

    List<AmountByMonth> findMonthlyTotals(String email, int year);

    List<AmountByDate> findDailyTotals(String email, LocalDate startDate, LocalDate endDate);
}
