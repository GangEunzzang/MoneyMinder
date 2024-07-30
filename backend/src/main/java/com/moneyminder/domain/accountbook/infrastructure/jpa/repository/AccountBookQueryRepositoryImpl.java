package com.moneyminder.domain.accountbook.infrastructure.jpa.repository;

import static com.moneyminder.domain.accountbook.infrastructure.jpa.entity.QAccountBookEntity.accountBookEntity;
import static com.moneyminder.domain.category.Infrastructure.jpa.entity.QCategoryEntity.categoryEntity;

import com.moneyminder.domain.accountbook.application.dto.response.AccountBookServiceRes;
import com.moneyminder.domain.accountbook.application.dto.response.QAccountBookServiceRes;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;

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



}
