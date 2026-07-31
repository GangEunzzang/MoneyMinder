package com.moneyminder.domain.accountbook.infrastructure.jpa.repository;

import static com.moneyminder.domain.accountbook.infrastructure.jpa.entity.QAccountBookEntity.accountBookEntity;
import static com.moneyminder.domain.category.infrastructure.jpa.entity.QCategoryEntity.categoryEntity;

import com.moneyminder.domain.accountbook.domain.AccountBookSearchCond;
import com.moneyminder.domain.accountbook.domain.AccountBookWithCategory;
import com.moneyminder.domain.accountbook.domain.AmountByDate;
import com.moneyminder.domain.accountbook.domain.AmountByMonth;
import com.querydsl.core.types.ConstructorExpression;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;

@RequiredArgsConstructor
public class AccountBookQueryRepositoryImpl implements AccountBookQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public AccountBookWithCategory findWithCategoryById(Long id) {
        return selectWithCategory()
                .where(accountBookEntity.id.eq(id))
                .fetchOne();
    }

    @Override
    public List<AccountBookWithCategory> findWithCategoryByEmail(String email) {
        return selectWithCategory()
                .where(accountBookEntity.userEmail.eq(email))
                .fetch();
    }

    @Override
    public List<AccountBookWithCategory> findWithCategoryByEmailAndSearch(String email, AccountBookSearchCond cond) {
        return selectWithCategory()
                .where(accountBookEntity.userEmail.eq(email),
                        greaterThanEqualDate(cond.startDate()),
                        lessThanEqualDate(cond.endDate()),
                        eqCategoryCode(cond.categoryCode()),
                        containsMemo(cond.memo()),
                        lessThanCursorId(cond.cursorId()))
                .orderBy(accountBookEntity.id.desc())
                .limit(20)
                .fetch();
    }

    @Override
    public List<AccountBookWithCategory> findWithCategoryByDate(String email, LocalDate startDate, LocalDate endDate) {
        return selectWithCategory()
                .where(accountBookEntity.userEmail.eq(email),
                        accountBookEntity.transactionDate.between(startDate, endDate))
                .fetch();
    }

    @Override
    public List<AmountByMonth> findMonthlyTotals(String email, int year) {
        return queryFactory.select(Projections.constructor(AmountByMonth.class,
                        accountBookEntity.transactionDate.month(),
                        categoryEntity.categoryType,
                        accountBookEntity.amount.sum()))
                .from(accountBookEntity)
                .leftJoin(categoryEntity).on(accountBookEntity.categoryCode.eq(categoryEntity.categoryCode))
                .where(accountBookEntity.userEmail.eq(email),
                        accountBookEntity.transactionDate.year().eq(year))
                .groupBy(accountBookEntity.transactionDate.month(), categoryEntity.categoryType)
                .fetch();
    }

    @Override
    public List<AmountByDate> findDailyTotals(String email, LocalDate startDate, LocalDate endDate) {
        return queryFactory.select(Projections.constructor(AmountByDate.class,
                        accountBookEntity.transactionDate,
                        categoryEntity.categoryType,
                        accountBookEntity.amount.sum()))
                .from(accountBookEntity)
                .leftJoin(categoryEntity).on(accountBookEntity.categoryCode.eq(categoryEntity.categoryCode))
                .where(accountBookEntity.userEmail.eq(email),
                        accountBookEntity.transactionDate.between(startDate, endDate))
                .groupBy(accountBookEntity.transactionDate, categoryEntity.categoryType)
                .fetch();
    }

    private com.querydsl.jpa.impl.JPAQuery<AccountBookWithCategory> selectWithCategory() {
        return queryFactory.select(withCategoryProjection())
                .from(accountBookEntity)
                .leftJoin(categoryEntity).on(accountBookEntity.categoryCode.eq(categoryEntity.categoryCode));
    }

    private ConstructorExpression<AccountBookWithCategory> withCategoryProjection() {
        return Projections.constructor(AccountBookWithCategory.class,
                accountBookEntity.id,
                accountBookEntity.amount,
                accountBookEntity.transactionDate,
                accountBookEntity.memo,
                categoryEntity.categoryCode,
                categoryEntity.categoryName,
                categoryEntity.categoryType);
    }

    private BooleanExpression eqCategoryCode(String categoryCode) {
        return StringUtils.isBlank(categoryCode) ? null : accountBookEntity.categoryCode.eq(categoryCode);
    }

    private BooleanExpression lessThanEqualDate(LocalDate endDate) {
        return endDate == null ? null : accountBookEntity.transactionDate.loe(endDate);
    }

    private BooleanExpression greaterThanEqualDate(LocalDate startDate) {
        return startDate == null ? null : accountBookEntity.transactionDate.goe(startDate);
    }

    private BooleanExpression containsMemo(String memo) {
        return StringUtils.isBlank(memo) ? null : accountBookEntity.memo.contains(memo);
    }

    private BooleanExpression lessThanCursorId(Long cursorId) {
        return cursorId == null ? null : accountBookEntity.id.lt(cursorId);
    }
}
