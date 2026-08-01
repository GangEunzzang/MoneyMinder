package com.moneyminder.domain.budget;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moneyminder.domain.budget.application.BudgetService;
import com.moneyminder.domain.budget.application.dto.request.BudgetServiceCreateReq;
import com.moneyminder.domain.budget.application.dto.request.BudgetServiceSearchReq;
import com.moneyminder.domain.budget.application.dto.response.BudgetServiceRes;
import com.moneyminder.domain.budget.domain.repository.BudgetRepository;
import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.repository.CategoryRepository;
import com.moneyminder.domain.category.domain.type.CategoryType;
import com.moneyminder.global.exception.BaseException;
import java.math.BigInteger;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * 앱의 "월 예산" 은 카테고리가 없는 총액이다. 카테고리를 필수로 두면 그 값을 서버에 담을 수 없다.
 */
@SpringBootTest
class TotalBudgetTest {

    private static final String EMAIL = "total-budget-test@moneyminder.com";
    private static final String CATEGORY_CODE = "TBT001";

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setUp() {
        budgetRepository.deleteAllInBatch();

        if (categoryRepository.findByCategoryCode(CATEGORY_CODE).isEmpty()) {
            categoryRepository.save(Category.builder()
                    .categoryCode(CATEGORY_CODE)
                    .categoryName("테스트카테고리")
                    .categoryType(CategoryType.EXPENSE)
                    .isCustom(true)
                    .userEmail(EMAIL)
                    .description("설명")
                    .build());
        }
    }

    private BudgetServiceCreateReq 예산(String categoryCode, long amount) {
        return BudgetServiceCreateReq.builder()
                .year(2026)
                .month(8)
                .userEmail(EMAIL)
                .categoryCode(categoryCode)
                .amount(BigInteger.valueOf(amount))
                .build();
    }

    @DisplayName("카테고리 없이 그 달 총액을 세울 수 있다.")
    @Test
    void whenNoCategory_thenTotalBudget() {
        BudgetServiceRes response = budgetService.create(예산(null, 1_200_000));

        assertThat(response.categoryCode()).isNull();
        assertThat(response.amount()).isEqualTo(BigInteger.valueOf(1_200_000));
    }

    @DisplayName("총액 예산도 목록에 나온다. 카테고리가 없다고 빠지지 않는다.")
    @Test
    void whenTotalBudget_thenListed() {
        budgetService.create(예산(null, 1_200_000));

        List<BudgetServiceRes> found = budgetService.getByEmailAndSearch(EMAIL,
                BudgetServiceSearchReq.builder().year(2026).month(8).build());

        assertThat(found).hasSize(1);
        assertThat(found.get(0).categoryCode()).isNull();
    }

    @DisplayName("총액과 카테고리별 예산은 같은 달에 함께 선다.")
    @Test
    void whenTotalAndCategory_thenBothKept() {
        budgetService.create(예산(null, 1_200_000));

        assertThatCode(() -> budgetService.create(예산(CATEGORY_CODE, 300_000)))
                .doesNotThrowAnyException();

        List<BudgetServiceRes> found = budgetService.getByEmailAndSearch(EMAIL,
                BudgetServiceSearchReq.builder().year(2026).month(8).build());

        assertThat(found).hasSize(2);
    }

    @DisplayName("총액 예산을 두 번 세우면 거부한다.")
    @Test
    void whenTotalTwice_thenRejected() {
        budgetService.create(예산(null, 1_200_000));

        assertThatThrownBy(() -> budgetService.create(예산(null, 900_000)))
                .isInstanceOf(BaseException.class);
    }
}
