package com.moneyminder.domain.budget.infrastructure.jpa.repository;

import com.moneyminder.domain.budget.application.dto.request.BudgetServiceSearchReq;
import com.moneyminder.domain.budget.application.dto.response.BudgetServiceRes;
import com.moneyminder.domain.budget.application.dto.response.QBudgetServiceRes;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

import static com.moneyminder.domain.budget.infrastructure.jpa.entity.QBudgetEntity.budgetEntity;
import static com.moneyminder.domain.category.Infrastructure.jpa.entity.QCategoryEntity.categoryEntity;

@RequiredArgsConstructor
public class BudgetQueryRepositoryImpl implements BudgetQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<BudgetServiceRes> findWithCategoryByEmailAndSearch(String email, BudgetServiceSearchReq searchReq) {
        return queryFactory.select(new QBudgetServiceRes(
                        budgetEntity.id,
                        budgetEntity.budgetYear,
                        budgetEntity.budgetMonth,
                        budgetEntity.amount,
                        categoryEntity.categoryCode,
                        categoryEntity.categoryName,
                        categoryEntity.categoryType)
                )
                .from(budgetEntity)
                .leftJoin(categoryEntity).on(budgetEntity.categoryCode.eq(categoryEntity.categoryCode))
                .where(budgetEntity.userEmail.eq(email),
                        eqCategoryCode(searchReq.categoryCode()),
                        eqYear(searchReq.year()),
                        eqMonth(searchReq.month()))
                .fetch();
    }

    public BooleanExpression eqCategoryCode(String categoryCode) {
        return StringUtils.isBlank(categoryCode) ? null : budgetEntity.categoryCode.eq(categoryCode);
    }

    public BooleanExpression eqYear(Integer year) {
        return year != null ? budgetEntity.budgetYear.eq(year) : null;
    }

    public BooleanExpression eqMonth(Integer month) {
        return month != null ? budgetEntity.budgetMonth.eq(month) : null;
    }

}
