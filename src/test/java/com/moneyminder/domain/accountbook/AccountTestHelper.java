package com.moneyminder.domain.accountbook;

import com.moneyminder.AuthHelper;
import com.moneyminder.domain.accountbook.presentation.dto.AccountBookCreateReq;
import com.moneyminder.domain.accountbook.presentation.dto.AccountBookUpdateReq;
import io.restassured.RestAssured;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import org.springframework.http.MediaType;

import java.math.BigInteger;
import java.time.LocalDate;

public class AccountTestHelper {

    public static ExtractableResponse<Response> 가계부_등록_요청(AccountBookCreateReq request) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .body(request)
                .when()
                .post("/api/v1/accountBook/create")
                .then()
                .log().all().extract();
    }

    public static AccountBookCreateReq 가계부_등록_요청_생성() {
        return AccountBookCreateReq.builder()
                .amount(new BigInteger("1000"))
                .categoryCode("code")
                .transactionDate(LocalDate.now())
                .memo("Sample memo")
                .build();
    }

    public static ExtractableResponse<Response> 가계부_수정_요청(AccountBookUpdateReq request) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .body(request)
                .when()
                .put("/api/v1/accountBook/update")
                .then()
                .log().all().extract();
    }

    public static AccountBookUpdateReq 가계부_수정_요청_생성() {
        return AccountBookUpdateReq.builder()
                .accountId(1L)
                .amount(new BigInteger("1500"))
                .categoryCode("code")
                .transactionDate(LocalDate.now())
                .memo("Updated memo")
                .build();
    }

    public static ExtractableResponse<Response> 가계부_삭제_요청(long accountId) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .delete("/api/v1/accountBook/delete/" + accountId)
                .then()
                .log().all().extract();
    }

    public static ExtractableResponse<Response> 가계부_조회_요청(long accountId) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .get("/api/v1/accountBook/id/" + accountId)
                .then()
                .log().all().extract();
    }

    public static ExtractableResponse<Response> 가계부_조회_요청_이메일() {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .get("/api/v1/accountBook/email")
                .then()
                .log().all().extract();
    }
}
