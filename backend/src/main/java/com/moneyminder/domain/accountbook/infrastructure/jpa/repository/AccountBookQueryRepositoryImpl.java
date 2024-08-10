package com.moneyminder.domain.accountbook.infrastructure.jpa.repository;

import static com.moneyminder.domain.accountbook.infrastructure.jpa.entity.QAccountBookEntity.accountBookEntity;
import static com.moneyminder.domain.category.Infrastructure.jpa.entity.QCategoryEntity.categoryEntity;

import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookServiceRes;
import com.moneyminder.domain.accountbook.application.dto.response.QAccountBookServiceRes;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;

@RequiredArgsConstructor
public class AccountBookQueryRepositoryImpl implements AccountBookQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public AccountBookServiceRes findWithCategoryById(Long id) {
        return queryFactory.select(new QAccountBookServiceRes(
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
    public List<AccountBookServiceRes> findWithCategoryByEmail(String email) {
        return queryFactory.select(new QAccountBookServiceRes(
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
    public List<AccountBookServiceRes> findWithCategoryByEmailAndCursorAndSearch(String email, Optional<Long> cursorId,
            AccountBookServiceSearchReq searchReq) {

        return queryFactory.select(new QAccountBookServiceRes(
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
                        lessThanCursorId(cursorId))
                .orderBy(accountBookEntity.id.desc())
                .limit(20)
                .fetch();
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

    private BooleanExpression lessThanCursorId(Optional<Long> cursorId) {
        return cursorId.map(accountBookEntity.id::lt).orElse(null);
    }
}
