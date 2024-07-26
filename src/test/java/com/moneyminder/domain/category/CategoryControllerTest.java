package com.moneyminder.domain.category;

import com.moneyminder.ControllerTest;
import com.moneyminder.domain.category.domain.repository.CategoryRepository;
import com.moneyminder.domain.category.presentation.dto.request.CategoryCreateReq;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

class CategoryControllerTest extends ControllerTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryTestHelper categoryTestHelper;

    @DisplayName("카테고리 등록")
    @Test
    void givenCategoryCreateRequest_whenCreateCategory_thenSuccess() {

        // given
        CategoryCreateReq request = categoryTestHelper.카테고리_등록_요청_생성();

        // when
        ExtractableResponse<Response> response = categoryTestHelper.카테고리_등록_요청(request);

        // then
        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(response.jsonPath().getString("data.categoryName")).isEqualTo("카테고리 이름"),
                () -> assertThat(categoryRepository.findByCategoryCode(response.jsonPath().getString("data.categoryCode")).isPresent()).isTrue()
        );
    }

    @DisplayName("카테고리 수정")
    @Test
    void givenCategoryUpdateRequest_whenUpdateCategory_thenSuccess() {

        // given
        categoryTestHelper.카테고리_등록_요청(categoryTestHelper.카테고리_등록_요청_생성());

        // when
        ExtractableResponse<Response> updateResponse = categoryTestHelper.카테고리_수정_요청(categoryTestHelper.카테고리_수정_요청_생성());

        // then
        assertAll(
                () -> assertThat(updateResponse.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(updateResponse.jsonPath().getString("data.categoryName")).isEqualTo("수정된 카테고리 이름"),
                () -> assertThat(categoryRepository.getById(1L).categoryName()).isEqualTo("수정된 카테고리 이름")
        );
    }

    @DisplayName("카테고리 삭제")
    @Test
    void givenCategoryId_whenDeleteCategory_thenSuccess() {

        // given
        categoryTestHelper.카테고리_등록_요청(categoryTestHelper.카테고리_등록_요청_생성());

        // when
        ExtractableResponse<Response> deleteResponse = categoryTestHelper.카테고리_삭제_요청(1L);

        // then
        assertAll(
                () -> assertThat(deleteResponse.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(categoryRepository.findById(1L).isEmpty()).isTrue()
        );
    }

    @DisplayName("카테고리 조회 - categoryId 조회")
    @Test
    void givenCategoryId_whenFindCategoryById_thenSuccess() {

        // given
        categoryTestHelper.카테고리_등록_요청(categoryTestHelper.카테고리_등록_요청_생성());

        // when
        ExtractableResponse<Response> response = categoryTestHelper.카테고리_조회_요청(1L);

        // then
        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(response.jsonPath().getString("data.categoryName")).isEqualTo("카테고리 이름")
        );
    }

    @DisplayName("카테고리 조회 - userEmail 조회")
    @Test
    void givenUserEmail_whenFindCategoryByUserEmail_thenSuccess() {

        // given
        categoryTestHelper.카테고리_등록_요청(categoryTestHelper.카테고리_등록_요청_생성());

        // when
        ExtractableResponse<Response> response = categoryTestHelper.카테고리_조회_요청_이메일(;

        // then
        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(response.jsonPath().getString("data[0].categoryName")).isEqualTo("카테고리 이름")
        );
    }


}