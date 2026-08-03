package com.moneyminder.domain.category;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moneyminder.ControllerTest;
import com.moneyminder.domain.category.domain.repository.CategoryRepository;
import com.moneyminder.domain.category.presentation.dto.CategoryCreateReq;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

class CategoryControllerTest extends ControllerTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @DisplayName("카테고리 등록")
    @Test
    void givenCategoryCreateRequest_whenCreateCategory_thenSuccess() {
        // given
        CategoryCreateReq request = CategoryTestHelper.카테고리_등록_요청_생성();

        // when
        ExtractableResponse<Response> response = CategoryTestHelper.카테고리_등록_요청(request);

        // then
        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(response.jsonPath().getString("data.categoryName")).isEqualTo("카테고리 이름"),
                () -> assertThat(categoryRepository.findByCategoryCode(response.jsonPath().getString("data.categoryCode")).isPresent()).isTrue()
        );
    }

    @DisplayName("아이콘·색이 등록·조회·수정을 왕복한다")
    @Test
    void givenIconAndColor_whenRoundTrip_thenKept() {
        ExtractableResponse<Response> created = CategoryTestHelper.카테고리_등록_요청(
                CategoryTestHelper.카테고리_등록_요청_생성());
        long categoryId = created.jsonPath().getLong("data.categoryId");

        ExtractableResponse<Response> found = CategoryTestHelper.카테고리_조회_요청(categoryId);
        ExtractableResponse<Response> updated = CategoryTestHelper.카테고리_수정_요청(
                CategoryTestHelper.카테고리_수정_요청_생성());

        assertAll(
                () -> assertThat(created.jsonPath().getString("data.icon")).isEqualTo("cafe"),
                () -> assertThat(created.jsonPath().getString("data.color")).isEqualTo("peach"),
                () -> assertThat(found.jsonPath().getString("data.icon")).isEqualTo("cafe"),
                () -> assertThat(found.jsonPath().getString("data.color")).isEqualTo("peach"),
                () -> assertThat(updated.jsonPath().getString("data.icon")).isEqualTo("wallet"),
                () -> assertThat(updated.jsonPath().getString("data.color")).isEqualTo("mint")
        );
    }

    @DisplayName("아이콘·색 없이 만든 카테고리는 비어서 돌아온다")
    @Test
    void givenNoIconAndColor_whenCreateCategory_thenNull() {
        CategoryCreateReq request = CategoryCreateReq.builder()
                .categoryName("아이콘 없는 카테고리")
                .categoryType("EXPENSE")
                .description("설명")
                .build();

        ExtractableResponse<Response> response = CategoryTestHelper.카테고리_등록_요청(request);

        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(response.jsonPath().getString("data.icon")).isNull(),
                () -> assertThat(response.jsonPath().getString("data.color")).isNull()
        );
    }

    @DisplayName("카테고리 수정")
    @Test
    void givenCategoryUpdateRequest_whenUpdateCategory_thenSuccess() {
        // given
        CategoryTestHelper.카테고리_등록_요청(CategoryTestHelper.카테고리_등록_요청_생성());

        // when
        ExtractableResponse<Response> updateResponse = CategoryTestHelper.카테고리_수정_요청(CategoryTestHelper.카테고리_수정_요청_생성());

        // then
        assertAll(
                () -> assertThat(updateResponse.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(updateResponse.jsonPath().getString("data.categoryName")).isEqualTo("수정된 카테고리 이름"),
                () -> assertThat(categoryRepository.getById(1L).getCategoryName()).isEqualTo("수정된 카테고리 이름")
        );
    }

    @DisplayName("카테고리 삭제")
    @Test
    void givenCategoryId_whenDeleteCategory_thenSuccess() {
        // given
        CategoryTestHelper.카테고리_등록_요청(CategoryTestHelper.카테고리_등록_요청_생성());

        // when
        ExtractableResponse<Response> deleteResponse = CategoryTestHelper.카테고리_삭제_요청(1L);

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
        CategoryTestHelper.카테고리_등록_요청(CategoryTestHelper.카테고리_등록_요청_생성());

        // when
        ExtractableResponse<Response> response = CategoryTestHelper.카테고리_조회_요청(1L);

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
        CategoryTestHelper.카테고리_등록_요청(CategoryTestHelper.카테고리_등록_요청_생성());

        // when
        ExtractableResponse<Response> response = CategoryTestHelper.카테고리_조회_요청_이메일();

        // then
        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(response.jsonPath().getString("data[0].categoryName")).isEqualTo("카테고리 이름")
        );
    }
}
