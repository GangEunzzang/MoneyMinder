package com.moneyminder.domain.budget;

import com.moneyminder.ControllerTest;
import com.moneyminder.domain.budget.domain.repository.BudgetRepository;
import com.moneyminder.domain.budget.presentation.dto.BudgetCreateReq;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.math.BigInteger;

import static com.moneyminder.domain.budget.BudgetTestHelper.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

public class BudgetControllerTest extends ControllerTest {

    @Autowired
    private BudgetRepository budgetRepository;

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

    @DisplayName("예산 조회 - year, month 조회")
    @Test
    void givenYearAndMonth_whenFindBudgetByYearAndMonth_thenSuccess() {

        // given
        예산_등록_요청(예산_등록_요청_생성("2021", "1", BigInteger.TEN));

        // when
        ExtractableResponse<Response> response = 연도_월별_예산_조회_요청(2021, 1);

        // then
        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(response.jsonPath().getString("data.year")).isEqualTo("2021"),
                () -> assertThat(response.jsonPath().getString("data.month")).isEqualTo("1"),
                () -> assertThat(response.jsonPath().getString("data.amount")).isEqualTo(BigInteger.TEN.toString())
        );
    }

    @DisplayName("예산 조회 - year 조회")
    @Test
    void givenYear_whenFindBudgetByYear_thenSuccess() {
        // given
        예산_등록_요청(예산_등록_요청_생성("2021", "1", BigInteger.TEN));
        예산_등록_요청(예산_등록_요청_생성("2021", "2", BigInteger.TEN));
        예산_등록_요청(예산_등록_요청_생성("2022", "1", BigInteger.TEN));

        // when
        ExtractableResponse<Response> response = 연도별_예산_조회_요청(2021);

        // then
        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(response.jsonPath().getList("data")).hasSize(2),
                () -> assertThat(response.jsonPath().getString("data[0].year")).isEqualTo("2021"),
                () -> assertThat(response.jsonPath().getString("data[0].month")).isEqualTo("1"),
                () -> assertThat(response.jsonPath().getString("data[0].amount")).isEqualTo(BigInteger.TEN.toString())
        );
    }


}
