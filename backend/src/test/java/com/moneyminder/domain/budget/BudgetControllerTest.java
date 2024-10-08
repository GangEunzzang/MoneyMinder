package com.moneyminder.domain.budget;

import com.moneyminder.ControllerTest;
import com.moneyminder.domain.budget.domain.repository.BudgetRepository;
import com.moneyminder.domain.budget.presentation.dto.BudgetCreateReq;
import com.moneyminder.domain.category.domain.repository.CategoryRepository;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.HttpStatus;

import java.math.BigInteger;

import static com.moneyminder.domain.budget.BudgetTestHelper.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.Mockito.when;

public class BudgetControllerTest extends ControllerTest {

    @Autowired
    private BudgetRepository budgetRepository;

    @SpyBean
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setupMocks() {
        when(categoryRepository.existsByCategoryCode(org.mockito.ArgumentMatchers.anyString())).thenReturn(true);
    }

    @DisplayName("예산 등록")
    @Test
    void givenBudgetCreateRequest_whenCreateBudget_thenSuccess() {
        // given
        BudgetCreateReq request = 예산_등록_요청_생성("2021", "1", BigInteger.TEN);

        // when
        ExtractableResponse<Response> response = 예산_등록_요청(request);

        // then
        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(response.jsonPath().getString("data.year")).isEqualTo("2021"),
                () -> assertThat(response.jsonPath().getString("data.month")).isEqualTo("1"),
                () -> assertThat(response.jsonPath().getString("data.amount")).isEqualTo(BigInteger.TEN.toString())
        );
    }

    @DisplayName("예산 수정")
    @Test
    void givenBudgetUpdateRequest_whenUpdateBudget_thenSuccess() {
        // given
        예산_등록_요청(예산_등록_요청_생성("2021", "1", BigInteger.TEN));

        // when
        ExtractableResponse<Response> updateResponse = 예산_수정_요청(예산_수정_요청_생성(1L, BigInteger.TWO));

        // then
        assertAll(
                () -> assertThat(updateResponse.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(updateResponse.jsonPath().getString("data.amount")).isEqualTo(BigInteger.TWO.toString()),
                () -> assertThat(budgetRepository.getById(1L).amount()).isEqualTo(BigInteger.TWO)
        );
    }

    @DisplayName("예산 삭제")
    @Test
    void givenBudgetId_whenDeleteBudget_thenSuccess() {
        // given
        예산_등록_요청(예산_등록_요청_생성("2021", "1", BigInteger.TEN));

        // when
        ExtractableResponse<Response> deleteResponse = 예산_삭제_요청(1L);

        // then
        assertAll(
                () -> assertThat(deleteResponse.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(budgetRepository.findById(1L).isPresent()).isFalse()
        );
    }

    @DisplayName("예산 조회 - budgetId 조회")
    @Test
    void givenBudgetId_whenFindBudgetById_thenSuccess() {
        // given
        예산_등록_요청(예산_등록_요청_생성("2021", "1", BigInteger.TEN));

        // when
        ExtractableResponse<Response> response = 예산_조회_요청(1L);

        // then
        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(response.jsonPath().getString("data.year")).isEqualTo("2021"),
                () -> assertThat(response.jsonPath().getString("data.month")).isEqualTo("1"),
                () -> assertThat(response.jsonPath().getString("data.amount")).isEqualTo(BigInteger.TEN.toString())
        );
    }

}
