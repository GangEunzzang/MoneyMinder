package com.moneyminder.domain.category;

import com.moneyminder.domain.auth.application.JwtProvider;
import com.moneyminder.domain.category.presentation.dto.request.CategoryCreateReq;
import com.moneyminder.domain.category.presentation.dto.request.CategoryUpdateRequest;
import com.moneyminder.domain.user.domain.type.UserRole;
import io.restassured.RestAssured;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

@Component
public class CategoryTestHelper {

    @Autowired
    private final JwtProvider jwtProvider;

    @Autowired
    public CategoryTestHelper(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    public ExtractableResponse<Response> 카테고리_등록_요청(CategoryCreateReq request) {
        String accessToken = jwtProvider.generateToken("TestUser", UserRole.USER).accessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .body(request)
                .when()
                .post("/v1/api/categories/create")
                .then()
                .log().all().extract();
    }

    public CategoryCreateReq 카테고리_등록_요청_생성() {
        return CategoryCreateReq.builder()
                .categoryName("카테고리 이름")
                .categoryType("EXPENSE")
                .description("카테고리 설명")
                .build();
    }


    public ExtractableResponse<Response> 카테고리_수정_요청(CategoryUpdateRequest request) {
        String accessToken = jwtProvider.generateToken("TestUser", UserRole.USER).accessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .body(request)
                .when()
                .put("/v1/api/categories/update")
                .then()
                .log().all().extract();
    }

    public CategoryUpdateRequest 카테고리_수정_요청_생성() {
        return CategoryUpdateRequest.builder()
                .categoryId(1L)
                .categoryName("수정된 카테고리 이름")
                .categoryType("INCOME")
                .description("수정된 카테고리 설명")
                .build();
    }

    public ExtractableResponse<Response> 카테고리_삭제_요청(long categoryId) {
        String accessToken = jwtProvider.generateToken("TestUser", UserRole.USER).accessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .delete("/v1/api/categories/delete/" + categoryId)
                .then()
                .log().all().extract();
    }

    public ExtractableResponse<Response> 카테고리_조회_요청(long categoryId) {
        String accessToken = jwtProvider.generateToken("TestUser", UserRole.USER).accessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .get("/v1/api/categories/id/" + categoryId)
                .then()
                .log().all().extract();
    }

    public ExtractableResponse<Response> 카테고리_조회_요청_이메일() {
        String accessToken = jwtProvider.generateToken("TestUser", UserRole.USER).accessToken();

        return RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .get("/v1/api/categories/email")
                .then()
                .log().all().extract();
    }
}
