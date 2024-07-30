package com.moneyminder.domain.category;

import com.moneyminder.AuthHelper;
import com.moneyminder.domain.category.presentation.dto.request.CategoryCreateReq;
import com.moneyminder.domain.category.presentation.dto.request.CategoryUpdateReq;
import io.restassured.RestAssured;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

@Component
public class CategoryTestHelper {

    public static ExtractableResponse<Response> 카테고리_등록_요청(CategoryCreateReq request) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .body(request)
                .when()
                .post("/v1/api/categories/create")
                .then()
                .log().all().extract();
    }

    public static CategoryCreateReq 카테고리_등록_요청_생성() {
        return CategoryCreateReq.builder()
                .categoryName("카테고리 이름")
                .categoryType("EXPENSE")
                .description("카테고리 설명")
                .build();
    }


    public static ExtractableResponse<Response> 카테고리_수정_요청(CategoryUpdateReq request) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .body(request)
                .when()
                .put("/v1/api/categories/update")
                .then()
                .log().all().extract();
    }

    public static CategoryUpdateReq 카테고리_수정_요청_생성() {
        return CategoryUpdateReq.builder()
                .categoryId(1L)
                .categoryName("수정된 카테고리 이름")
                .categoryType("INCOME")
                .description("수정된 카테고리 설명")
                .build();
    }

    public static ExtractableResponse<Response> 카테고리_삭제_요청(long categoryId) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .delete("/v1/api/categories/delete/" + categoryId)
                .then()
                .log().all().extract();
    }

    public static ExtractableResponse<Response> 카테고리_조회_요청(long categoryId) {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .get("/v1/api/categories/id/" + categoryId)
                .then()
                .log().all().extract();
    }

    public static ExtractableResponse<Response> 카테고리_조회_요청_이메일() {
        String accessToken = AuthHelper.getAccessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .get("/v1/api/categories/email")
                .then()
                .log().all().extract();
    }
}
