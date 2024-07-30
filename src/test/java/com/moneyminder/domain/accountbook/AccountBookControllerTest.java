package com.moneyminder.domain.accountbook;

import com.moneyminder.ControllerTest;
import com.moneyminder.domain.accountbook.domain.repository.AccountBookRepository;
import com.moneyminder.domain.accountbook.presentation.dto.AccountBookCreateReq;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.math.BigInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

class AccountBookControllerTest extends ControllerTest {

    @Autowired
    private AccountBookRepository accountBookRepository;

    @Autowired
    private AccountTestHelper accountTestHelper;


    @DisplayName("가계부 등록")
    @Test
    void givenAccountBookCreateRequest_whenCreateAccountBook_thenSuccess() {
        // given
        AccountBookCreateReq request = accountTestHelper.가계부_등록_요청_생성();

        // when
        ExtractableResponse<Response> response = accountTestHelper.가계부_등록_요청(request);

        // then
        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(response.jsonPath().getString("data.amount")).isEqualTo("1000"),
                () -> assertThat(accountBookRepository.findById(1L)).isPresent()
        );
    }

    @DisplayName("가계부 수정")
    @Test
    void givenAccountBookUpdateRequest_whenUpdateAccountBook_thenSuccess() {
        // given
        accountTestHelper.가계부_등록_요청(accountTestHelper.가계부_등록_요청_생성());

        // when
        ExtractableResponse<Response> updateResponse = accountTestHelper.가계부_수정_요청(accountTestHelper.가계부_수정_요청_생성());

        // then
        assertAll(
                () -> assertThat(updateResponse.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(updateResponse.jsonPath().getString("data.amount")).isEqualTo("1500"),
                () -> assertThat(accountBookRepository.findById(1L).get().amount()).isEqualTo(new BigInteger("1500"))
        );
    }

    @DisplayName("가계부 삭제")
    @Test
    void givenAccountBookDeleteRequest_whenDeleteAccountBook_thenSuccess() {
        // given
        accountTestHelper.가계부_등록_요청(accountTestHelper.가계부_등록_요청_생성());

        // when
        ExtractableResponse<Response> deleteResponse = accountTestHelper.가계부_삭제_요청(1L);

        // then
        assertAll(
                () -> assertThat(deleteResponse.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(accountBookRepository.findById(1L)).isEmpty()
        );
    }

    @DisplayName("가계부 조회 - accountId 조회")
    @Test
    void givenAccountId_whenGetAccountBook_thenSuccess() {
        // given
        accountTestHelper.가계부_등록_요청(accountTestHelper.가계부_등록_요청_생성());

        // when
        ExtractableResponse<Response> response = accountTestHelper.가계부_조회_요청(1L);

        // then
        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(response.jsonPath().getString("data.amount")).isEqualTo("1000")
        );
    }

    @DisplayName("가계부 조회 - 이메일 조회")
    @Test
    void givenEmail_whenGetAccountBook_thenSuccess() {
        // given
        accountTestHelper.가계부_등록_요청(accountTestHelper.가계부_등록_요청_생성());
        accountTestHelper.가계부_등록_요청(accountTestHelper.가계부_등록_요청_생성());

        // when
        ExtractableResponse<Response> response = accountTestHelper.가계부_조회_요청_이메일();

        // then
        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(response.jsonPath().getList("data")).hasSize(2),
                () -> assertThat(response.jsonPath().getString("data[0].amount")).isEqualTo("1000")
        );
    }

}