package com.moneyminder.domain.budget;

import com.moneyminder.domain.budget.application.BudgetService;
import com.moneyminder.domain.budget.application.dto.request.BudgetServiceCreateReq;
import com.moneyminder.domain.budget.application.dto.request.BudgetServiceSearchReq;
import com.moneyminder.domain.budget.application.dto.request.BudgetServiceUpdateReq;
import com.moneyminder.domain.budget.application.dto.response.BudgetServiceRes;
import com.moneyminder.domain.budget.domain.Budget;
import com.moneyminder.domain.budget.domain.repository.BudgetRepository;
import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.repository.CategoryRepository;
import com.moneyminder.domain.category.domain.type.CategoryType;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigInteger;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@SpringBootTest
public class BudgetServiceTest {

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SpyBean
    private CategoryRepository categoryRepository;

    private final Budget setupBudget = Budget.builder()
            .year(2021)
            .month(1)
            .userEmail("테스트")
            .categoryCode("카테고리코드")
            .amount(BigInteger.valueOf(100000))
            .build();

    @BeforeEach
    public void setUp() {
        jdbcTemplate.execute("TRUNCATE TABLE budget");
        jdbcTemplate.execute("ALTER TABLE budget ALTER COLUMN id RESTART WITH 1");
        budgetRepository.save(setupBudget);

        // 카테고리도 초기화 (필요 시)
        jdbcTemplate.execute("TRUNCATE TABLE category");
        jdbcTemplate.execute("ALTER TABLE category ALTER COLUMN id RESTART WITH 1");

        // 카테고리를 isDeleted = false로 저장
        Category category = Category.builder()
                .categoryCode("카테고리코드")
                .categoryName("테스트카테고리")
                .categoryType(CategoryType.EXPENSE)
                .isCustom(true)
                .userEmail("테스트")
                .description("설명")
                .build();

        categoryRepository.save(category);

        given(categoryRepository.existsByCategoryCode("카테고리코드")).willReturn(true);
    }

    @Nested
    class 성공테스트 {

        @DisplayName("생성 - 성공적으로 예산을 생성한다.")
        @Test
        void whenCreateBudget_thenSuccess() {
            // given
            BudgetServiceCreateReq request = BudgetServiceCreateReq.builder()
                    .year(2021)
                    .month(2)
                    .userEmail("테스트")
                    .categoryCode("카테고리코드")
                    .amount(BigInteger.valueOf(100000))
                    .build();

            // when
            BudgetServiceRes response = budgetService.create(request);
            Budget findBudget = budgetRepository.findById(response.budgetId()).get();

            // then
            assertThat(findBudget.year()).isEqualTo(request.year());
        }

        @DisplayName("수정 - 성공적으로 예산을 수정한다.")
        @Test
        void whenUpdateBudget_thenSuccess() {
            // given
            BudgetServiceUpdateReq request = BudgetServiceUpdateReq.builder()
                    .budgetId(1L)
                    .userEmail("테스트")
                    .amount(BigInteger.valueOf(20000))
                    .build();

            // when
            budgetService.update(request);
            Budget findBudget = budgetRepository.findById(1L).get();

            // then
            assertThat(findBudget.amount()).isEqualTo(20000);
        }

        @DisplayName("삭제 - 성공적으로 예산을 삭제한다.")
        @Test
        void whenDeleteBudget_thenSuccess() {
            // given
            Long budgetId = 1L;
            String email = "테스트";

            // when
            budgetService.delete(budgetId, email);

            // then
            assertThat(budgetRepository.findById(budgetId)).isEmpty();
        }

        @DisplayName("조회 - 성공적으로 예산을 조회한다.")
        @Test
        void whenGetBudget_thenSuccess() {
            // given
            Long budgetId = 1L;

            // when
            BudgetServiceRes response = budgetService.getById(budgetId);

            // then
            assertThat(response.budgetId()).isEqualTo(budgetId);
        }

        @DisplayName("조회 - 성공적으로 사용자의 연도별 예산을 조회한다.")
        @Test
        void whenGetBudgetByUserEmailAndYear_thenSuccess() {
            // given
            String email = "테스트";
            Integer year = 2021;

            Budget budget = Budget.create(BudgetServiceCreateReq.builder()
                    .year(2022)
                    .month(2)
                    .userEmail("테스트")
                    .amount(BigInteger.valueOf(100000))
                    .categoryCode("카테고리코드")
                    .build());

            budgetRepository.save(budget);

            // when
            List<BudgetServiceRes> yearBudgetList = budgetService.getByEmailAndSearch(email,
                    BudgetServiceSearchReq.builder()
                            .year(year)
                            .build()
            );

            // then
            assertThat(yearBudgetList.size()).isEqualTo(1);
            assertThat(yearBudgetList.get(0).year()).isEqualTo(year);
        }

        @DisplayName("조회 - 성공적으로 사용자의 연도와 월별 예산을 조회한다. (카테고리와 inner join)")
        @Test
        void whenGetBudgetByUserEmailAndYearAndMonth_thenSuccess() {
            // given
            String email = setupBudget.userEmail();
            Integer year = setupBudget.year();
            Integer month = setupBudget.month();

            // when
            List<BudgetServiceRes> response = budgetService.getByEmailAndSearch(email,
                    BudgetServiceSearchReq.builder()
                            .year(year)
                            .month(month)
                            .build()
            );

            // then
            assertThat(response.get(0).year()).isEqualTo(year);
            assertThat(response.get(0).month()).isEqualTo(month);
        }

        @DisplayName("조회 - 연도별 예산 조회시 해당 연도의 예산이 없을 경우 빈 리스트를 반환한다.")
        @Test
        void whenGetBudgetByUserEmailAndYear_thenEmptyList() {
            // given
            String email = "없는유저";

            // when
            List<BudgetServiceRes> response = budgetService.getByEmailAndSearch(email, BudgetServiceSearchReq.builder().build());

            // then
            assertThat(response).isEmpty();
        }

        @DisplayName("조회 - 연도와 월별 예산 조회시 해당 연도와 월의 예산이 없을 경우 빈 리스트를 반환한다.")
        @Test
        void whenGetBudgetByUserEmailAndYearAndMonth_thenEmptyList() {
            // given
            String email = "없는유저";

            // when
            List<BudgetServiceRes> response = budgetService.getByEmailAndSearch(email, BudgetServiceSearchReq.builder().build());

            // then
            assertThat(response).isEmpty();
        }

    }

    @Nested
    class 예외테스트 {

        @DisplayName("생성 - 사용자의 연도와 월, 카테고리가 중복되는 예산이 이미 존재할 경우 예외를 발생시킨다.")
        @Test
        void whenCreateBudget_thenThrowException() {
            // given
            BudgetServiceCreateReq request = BudgetServiceCreateReq.builder()
                    .year(setupBudget.year())
                    .month(setupBudget.month())
                    .userEmail(setupBudget.userEmail())
                    .amount(BigInteger.valueOf(100000))
                    .categoryCode(setupBudget.categoryCode())
                    .build();

            // when, then
            assertThatThrownBy(() -> budgetService.create(request))
                    .isInstanceOf(BaseException.class)
                    .hasFieldOrPropertyWithValue("resultCode", ResultCode.BUDGET_ALREADY_EXISTS);
        }

        @DisplayName("생성 - 존재하지 않는 카테고리 코드로 예산을 생성할 경우 예외를 발생시킨다.")
        @Test
        void whenCreateBudgetNotFoundCategory_thenThrowException() {
            // given
            BudgetServiceCreateReq request = BudgetServiceCreateReq.builder()
                    .year(2021)
                    .month(2)
                    .userEmail("테스트")
                    .amount(BigInteger.valueOf(100000))
                    .categoryCode("존재하지않는카테고리코드")
                    .build();

            // when, then
            assertThatThrownBy(() -> budgetService.create(request))
                    .isInstanceOf(BaseException.class)
                    .hasFieldOrPropertyWithValue("resultCode", ResultCode.CATEGORY_NOT_FOUND);
        }

        @DisplayName("수정 - 사용자의 이메일이 다를 경우 예외를 발생시킨다.")
        @Test
        void whenUpdateBudget_thenThrowException() {
            // given
            BudgetServiceUpdateReq request = BudgetServiceUpdateReq.builder()
                    .budgetId(1L)
                    .userEmail("다른사용자")
                    .amount(BigInteger.valueOf(20000))
                    .build();

            // when, then
            assertThatThrownBy(() -> budgetService.update(request))
                    .isInstanceOf(BaseException.class)
                    .hasFieldOrPropertyWithValue("resultCode", ResultCode.BUDGET_FORBIDDEN);
        }

        @DisplayName("삭제 - 사용자의 이메일이 다를 경우 예외를 발생시킨다.")
        @Test
        void whenDeleteBudget_thenThrowException() {
            // given
            Long budgetId = 1L;
            String email = "다른사용자";

            // when, then
            assertThatThrownBy(() -> budgetService.delete(budgetId, email))
                    .isInstanceOf(BaseException.class)
                    .hasFieldOrPropertyWithValue("resultCode", ResultCode.BUDGET_FORBIDDEN);
        }

        @DisplayName("조회 - 존재하지 않는 예산을 조회할 경우 예외를 발생시킨다.")
        @Test
        void whenGetBudget_thenThrowException() {
            // given
            Long budgetId = 2L;

            // when, then
            assertThatThrownBy(() -> budgetService.getById(budgetId))
                    .isInstanceOf(BaseException.class)
                    .hasFieldOrPropertyWithValue("resultCode", ResultCode.BUDGET_NOT_FOUND);
        }
    }

}
