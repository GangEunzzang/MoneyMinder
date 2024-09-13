package com.moneyminder.domain.accountbook.infrastructure.jpa.repository;

import static com.moneyminder.domain.accountbook.infrastructure.jpa.entity.QAccountBookEntity.accountBookEntity;
import static com.moneyminder.domain.category.Infrastructure.jpa.entity.QCategoryEntity.categoryEntity;

import com.moneyminder.domain.accountbook.application.dto.request.AccountBookMonthSummaryReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookWeekSummaryReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookDefaultRes;
import com.moneyminder.domain.accountbook.application.dto.response.QAccountBookDefaultRes;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;

@RequiredArgsConstructor
public class AccountBookQueryRepositoryImpl implements AccountBookQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public AccountBookDefaultRes findWithCategoryById(Long id) {
        return queryFactory.select(new QAccountBookDefaultRes(
                        accountBookEntity.id,
                        accountBookEntity.amount,
                        accountBookEntity.transactionDate,
                        accountBookEntity.memo,
                        categoryEntity.categoryCode,
                        categoryEntity.categoryName,
                        categoryEntity.categoryType)
                )
                .from(accountBookEntity)
                .leftJoin(categoryEntity).on(accountBookEntity.categoryCode.eq(categoryEntity.categoryCode))
                .where(accountBookEntity.id.eq(id))
                .fetchOne();
    }

    @Override
    public List<AccountBookDefaultRes> findWithCategoryByEmail(String email) {
        return queryFactory.select(new QAccountBookDefaultRes(
                        accountBookEntity.id,
                        accountBookEntity.amount,
                        accountBookEntity.transactionDate,
                        accountBookEntity.memo,
                        categoryEntity.categoryCode,
                        categoryEntity.categoryName,
                        categoryEntity.categoryType)
                )
                .from(accountBookEntity)
                .leftJoin(categoryEntity).on(accountBookEntity.categoryCode.eq(categoryEntity.categoryCode))
                .where(accountBookEntity.userEmail.eq(email))
                .fetch();
    }

    @Override
    public List<AccountBookDefaultRes> findWithCategoryByEmailAndSearch(String email, AccountBookServiceSearchReq searchReq) {

        return queryFactory.select(new QAccountBookDefaultRes(
                        accountBookEntity.id,
                        accountBookEntity.amount,
                        accountBookEntity.transactionDate,
                        accountBookEntity.memo,
                        categoryEntity.categoryCode,
                        categoryEntity.categoryName,
                        categoryEntity.categoryType)
                )
                .from(accountBookEntity)
                .leftJoin(categoryEntity).on(accountBookEntity.categoryCode.eq(categoryEntity.categoryCode))
                .where(accountBookEntity.userEmail.eq(email),
                        greaterThanEqualDate(searchReq.startDate()),
                        lessThanEqualDate(searchReq.endDate()),
                        eqCategoryCode(searchReq.categoryCode()),
                        containsMemo(searchReq.memo()),
                        lessThanCursorId(searchReq.cursorId()))
                .orderBy(accountBookEntity.id.desc())
                .limit(20)
                .fetch();
    }

    @Override
    public BigInteger findWeekTotalByCategoryType(String email, AccountBookWeekSummaryReq summaryReq) {
        BigInteger totalAmount = queryFactory.select(accountBookEntity.amount.sum())
                .from(accountBookEntity)
                .leftJoin(categoryEntity)
                .on(accountBookEntity.categoryCode.eq(categoryEntity.categoryCode))
                .where(
                        accountBookEntity.userEmail.eq(email),
                        accountBookEntity.transactionDate.between(summaryReq.startDate(), summaryReq.endDate()),
                        categoryEntity.categoryType.eq(summaryReq.categoryType()))
                .fetchOne();

        return totalAmount == null ? BigInteger.ZERO : totalAmount;
    }

    @Override
    public BigInteger findMonthTotalByCategoryType(String email, AccountBookMonthSummaryReq summaryReq) {
        BigInteger totalAmount = queryFactory.select(accountBookEntity.amount.sum())
                .from(accountBookEntity)
                .leftJoin(categoryEntity)
                .on(accountBookEntity.categoryCode.eq(categoryEntity.categoryCode))
                .where(
                        accountBookEntity.userEmail.eq(email),
                        accountBookEntity.transactionDate.year().eq(summaryReq.year()),
                        accountBookEntity.transactionDate.month().eq(summaryReq.month()),
                        categoryEntity.categoryType.eq(summaryReq.categoryType()))
                .fetchOne();

        return totalAmount == null ? BigInteger.ZERO : totalAmount;
    }

    public BooleanExpression eqCategoryCode(String categoryCode) {
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
