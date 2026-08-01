package com.moneyminder.domain.budget.infrastructure.jpa.repository;

import static com.moneyminder.domain.budget.infrastructure.jpa.entity.QBudgetEntity.budgetEntity;
import static com.moneyminder.domain.category.infrastructure.jpa.entity.QCategoryEntity.categoryEntity;

import com.moneyminder.domain.budget.domain.BudgetSearchCond;
import com.moneyminder.domain.budget.domain.BudgetWithCategory;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;

@RequiredArgsConstructor
public class BudgetQueryRepositoryImpl implements BudgetQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<BudgetWithCategory> findWithCategoryByEmailAndSearch(String email, BudgetSearchCond cond) {
        return queryFactory.select(Projections.constructor(BudgetWithCategory.class,
                        budgetEntity.id,
                        budgetEntity.budgetYear,
                        budgetEntity.budgetMonth,
                        budgetEntity.amount,
                        categoryEntity.categoryCode,
                        categoryEntity.categoryName,
                        categoryEntity.categoryType)
                )
                .from(budgetEntity)
                // 총액 예산은 카테고리가 없다. innerJoin 이면 그 행이 통째로 빠진다.
                .leftJoin(categoryEntity)
                .on(budgetEntity.categoryCode.eq(categoryEntity.categoryCode),
                        categoryEntity.isDeleted.eq(false))
                .where(budgetEntity.userEmail.eq(email),
                        eqCategoryCode(cond.categoryCode()),
                        eqYear(cond.year()),
                        eqMonth(cond.month()))
                .fetch();
    }

    private BooleanExpression eqCategoryCode(String categoryCode) {
        return StringUtils.isBlank(categoryCode) ? null : budgetEntity.categoryCode.eq(categoryCode);
    }

    private BooleanExpression eqYear(Integer year) {
        return year != null ? budgetEntity.budgetYear.eq(year) : null;
    }

    private BooleanExpression eqMonth(Integer month) {
        return month != null ? budgetEntity.budgetMonth.eq(month) : null;
    }

}
