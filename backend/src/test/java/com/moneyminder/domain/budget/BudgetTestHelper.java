package com.moneyminder.domain.budget;

import com.moneyminder.AuthHelper;
import com.moneyminder.domain.budget.presentation.dto.BudgetCreateReq;
import com.moneyminder.domain.budget.presentation.dto.BudgetUpdateReq;
import io.restassured.RestAssured;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.math.BigInteger;

@Component
public class BudgetTestHelper {

    public static ExtractableResponse<Response> 예산_등록_요청(BudgetCreateReq request) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .body(request)
                .when()
                .post("/api/v1/budget/create")
                .then()
                .log().all().extract();
    }

    public static BudgetCreateReq 예산_등록_요청_생성(String year, String month, BigInteger amount) {
        return BudgetCreateReq.builder()
                .year(year)
                .month(month)
                .amount(amount)
                .build();
    }

    public static ExtractableResponse<Response> 예산_수정_요청(BudgetUpdateReq request) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .body(request)
                .when()
                .put("/api/v1/budget/update")
                .then()
                .log().all().extract();
    }

    public static BudgetUpdateReq 예산_수정_요청_생성(long budgetId, BigInteger amount) {
        return BudgetUpdateReq.builder()
                .budgetId(budgetId)
                .amount(amount)
                .build();
    }

    public static ExtractableResponse<Response> 예산_삭제_요청(long budgetId) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .delete("/api/v1/budget/delete/" + budgetId)
                .then()
                .log().all().extract();
    }

    public static ExtractableResponse<Response> 예산_조회_요청(long budgetId) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .get("/api/v1/budget/id/" + budgetId)
                .then()
                .log().all().extract();
    }

    public static ExtractableResponse<Response> 연도별_예산_조회_요청(int year) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .param("year", year)
                .when()
                .get("/api/v1/budget/year")
                .then()
                .log().all().extract();
    }

    public static ExtractableResponse<Response> 연도_월별_예산_조회_요청(int year, int month) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .param("year", year)
                .param("month", month)
                .when()
                .get("/api/v1/budget/year/month")
                .then()
                .log().all().extract();
    }


}
