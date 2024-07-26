package com.moneyminder.domain.category;

import com.moneyminder.domain.category.application.CategoryService;
import com.moneyminder.domain.category.application.dto.CategoryServiceCreateReq;
import com.moneyminder.domain.category.application.dto.CategoryServiceUpdateReq;
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
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ActiveProfiles("test")
@SpringBootTest
class CategoryServiceTest {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        categoryRepository.deleteAllInBatch();
        jdbcTemplate.update("ALTER TABLE category ALTER COLUMN id RESTART WITH 1");
        categoryRepository.save(Category.builder()
                .categoryName("테스트이름")
                .categoryType(CategoryType.EXPENSE)
                .description("테스트설명")
                .userEmail("테스트이메일")
                .categoryCode("테스트코드")
                .isCustom(true)
                .build());
    }

    @Nested
    class 성공테스트 {

        @DisplayName("생성 - 성공적으로 카테고리를 생성한다")
        @Test
        void whenCreateCategory_thenCategoryIsCreated() {
            // given
            CategoryServiceCreateReq request = CategoryServiceCreateReq.builder()
                    .categoryName("카테고리")
                    .categoryType(CategoryType.EXPENSE)
                    .description("카테고리 설명")
                    .userEmail("이메일")
                    .build();

            // when
            Category createdCategory = categoryService.create(request);
            Category fetchedCategory = categoryRepository.findById(createdCategory.id()).get();

            // then
            assertThat(fetchedCategory.categoryName()).isEqualTo("카테고리");
            assertThat(fetchedCategory.categoryType()).isEqualTo(CategoryType.EXPENSE);
            assertThat(fetchedCategory.description()).isEqualTo("카테고리 설명");
            assertThat(fetchedCategory.isCustom()).isTrue();
        }

        @DisplayName("수정 - 기존 카테고리를 성공적으로 수정한다")
        @Test
        void whenUpdateCategory_thenCategoryIsUpdated() {
            // given
            CategoryServiceUpdateReq request = CategoryServiceUpdateReq.builder()
                    .categoryName("수정된 카테고리")
                    .categoryType(CategoryType.INCOME)
                    .description("수정된 카테고리 설명")
                    .userEmail("테스트이메일")
                    .categoryId(1L)
                    .build();

            // when
            Category updatedCategory = categoryService.update(request);

            // then
            assertThat(updatedCategory.categoryName()).isEqualTo("수정된 카테고리");
            assertThat(updatedCategory.categoryType()).isEqualTo(CategoryType.INCOME);
            assertThat(updatedCategory.description()).isEqualTo("수정된 카테고리 설명");
        }

        @DisplayName("삭제 - 특정 카테고리를 성공적으로 삭제한다")
        @Test
        void whenDeleteCategory_thenCategoryIsDeleted() {
            // given
            Long categoryId = categoryRepository.findByCategoryCode("테스트코드").get().id();
            String userEmail = "테스트이메일";

            // when
            categoryService.delete(categoryId, userEmail);

            // then
            assertThat(categoryRepository.findByCategoryCode("테스트코드")).isEmpty();
        }

        @DisplayName("조회 - ID로 카테고리를 성공적으로 조회한다")
        @Test
        void whenGetCategoryById_thenCategoryIsFound() {
            // given
            Long categoryId = categoryRepository.findByCategoryCode("테스트코드").get().id();

            // when
            Category category = categoryService.getCategoryById(categoryId);

            // then
            assertThat(category.categoryName()).isEqualTo("테스트이름");
            assertThat(category.categoryType()).isEqualTo(CategoryType.EXPENSE);
            assertThat(category.description()).isEqualTo("테스트설명");
        }

        @DisplayName("조회 - 코드로 카테고리를 성공적으로 조회한다")
        @Test
        void whenGetCategoryByCode_thenCategoryIsFound() {
            // given
            String categoryCode = "테스트코드";

            // when
            Category category = categoryService.getCategoryByCode(categoryCode);

            // then
            assertThat(category.categoryName()).isEqualTo("테스트이름");
            assertThat(category.categoryType()).isEqualTo(CategoryType.EXPENSE);
            assertThat(category.description()).isEqualTo("테스트설명");
        }

        @DisplayName("조회 - 기본 카테고리를 성공적으로 조회한다")
        @Test
        void whenGetDefaultCategoryList_thenDefaultCategoriesAreFound() {
            //given
            categoryRepository.save(Category.builder()
                    .categoryName("기본카테고리")
                    .categoryType(CategoryType.EXPENSE)
                    .description("기본카테고리 설명")
                    .userEmail("이메일")
                    .categoryCode("기본코드")
                    .isCustom(false)
                    .build());

            // when
            int defaultCategorySize = categoryService.getDefaultCategories().size();

            // then
            assertThat(defaultCategorySize).isEqualTo(1);
        }

        @DisplayName("조회 - 사용자 이메일로 카테고리를 성공적으로 조회한다")
        @Test
        void whenGetCategoryListByUserEmail_thenCategoriesAreFound() {
            //given
            categoryRepository.save(Category.builder()
                    .categoryName("유저카테고리")
                    .categoryType(CategoryType.EXPENSE)
                    .description("유저카테고리 설명")
                    .userEmail("이메일")
                    .categoryCode("유저코드")
                    .isCustom(true)
                    .build());

            // when
            int userCategorySize = categoryService.getCategoriesByEmail("이메일").size();

            // then
            assertThat(userCategorySize).isEqualTo(1);
        }

        @DisplayName("조회 - 기본 카테고리 + 사용자가 생성한 카테고리를 성공적으로 조회한다")
        @Test
        void whenGetCategoriesForUser_thenCategoriesAreFound() {
            //given
            categoryRepository.save(Category.builder()
                    .categoryName("유저카테고리")
                    .categoryType(CategoryType.EXPENSE)
                    .description("유저카테고리 설명")
                    .userEmail("이메일")
                    .categoryCode("유저코드")
                    .isCustom(true)
                    .build());

            categoryRepository.save(Category.builder()
                    .categoryName("유저카테고리2")
                    .categoryType(CategoryType.EXPENSE)
                    .description("유저카테고리 설명")
                    .userEmail("DEFAULT_CATEGORY")
                    .categoryCode("유저코드2")
                    .isCustom(false)
                    .build());

            // when
            int userCategorySize = categoryService.getCategoriesForUser("이메일").size();

            // then
            assertThat(userCategorySize).isEqualTo(2);
        }


    }

    @Nested
    class 예외테스트 {

        @DisplayName("생성 - 카테고리 생성 시 카테고리 이름이 비어있으면 예외가 발생한다")
        @Test
        void whenCreateCategoryWithEmptyCategoryName_thenThrowException() {
            // given
            CategoryServiceCreateReq request = CategoryServiceCreateReq.builder()
                    .categoryName("")
                    .categoryType(CategoryType.EXPENSE)
                    .description("카테고리 설명")
                    .userEmail("이메일")
                    .build();

            // when, then
            assertThatThrownBy(() -> categoryService.create(request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("categoryName must not be empty");
        }

        @DisplayName("생성 - 카테고리 생성 시 카테고리 타입이 비어있으면 예외가 발생한다")
        @Test
        void whenCreateCategoryWithEmptyCategoryType_thenThrowException() {
            // given
            CategoryServiceCreateReq request = CategoryServiceCreateReq.builder()
                    .categoryName("카테고리")
                    .description("카테고리 설명")
                    .userEmail("이메일")
                    .build();

            // when, then
            assertThatThrownBy(() -> categoryService.create(request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("categoryType must not be empty");
        }

        @DisplayName("생성 - 카테고리 생성 시 userEmail이 비어있으면 예외가 발생한다")
        @Test
        void whenCreateCategoryWithEmptyUserEmail_thenThrowException() {
            // given
            CategoryServiceCreateReq request = CategoryServiceCreateReq.builder()
                    .categoryName("카테고리")
                    .categoryType(CategoryType.EXPENSE)
                    .description("카테고리 설명")
                    .build();

            // when, then
            assertThatThrownBy(() -> categoryService.create(request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("userEmail must not be empty");
        }

        @DisplayName("생성 - 카테고리 생성 시 설명이 비어있으면 예외가 발생한다")
        @Test
        void whenCreateCategoryWithEmptyDescription_thenThrowException() {
            // given
            CategoryServiceCreateReq request = CategoryServiceCreateReq.builder()
                    .categoryName("카테고리")
                    .categoryType(CategoryType.EXPENSE)
                    .userEmail("이메일")
                    .build();

            // when, then
            assertThatThrownBy(() -> categoryService.create(request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("description must not be empty");
        }

        @DisplayName("수정 - 카테고리 수정 시 카테고리 ID가 비어있으면 예외가 발생한다")
        @Test
        void whenUpdateCategoryWithEmptyCategoryId_thenThrowException() {
            // given
            CategoryServiceUpdateReq request = CategoryServiceUpdateReq.builder()
                    .categoryName("수정된 카테고리")
                    .categoryType(CategoryType.INCOME)
                    .description("수정된 카테고리 설명")
                    .userEmail("테스트이메일")
                    .build();

            // when, then
            assertThatThrownBy(() -> categoryService.update(request))
                    .isInstanceOf(InvalidDataAccessApiUsageException.class)
                    .hasMessage("The given id must not be null");
        }

        @DisplayName("수정 - 카테고리 수정 시 카테고리 ID로 카테고리를 찾을 수 없으면 예외가 발생한다")
        @Test
        void whenUpdateCategoryWithNotFoundCategory_thenThrowException() {
            // given
            CategoryServiceUpdateReq request = CategoryServiceUpdateReq.builder()
                    .categoryName("수정된 카테고리")
                    .categoryType(CategoryType.INCOME)
                    .description("수정된 카테고리 설명")
                    .userEmail("테스트이메일")
                    .categoryId(9999999L)
                    .build();

            // when, then
            assertThatThrownBy(() -> categoryService.update(request))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.CATEGORY_NOT_FOUND.getMessage());
        }

        @DisplayName("수정 - 카테고리 수정 시 사용자 이메일이 다르면 예외가 발생한다")
        @Test
        void whenUpdateCategoryWithDifferentUserEmail_thenThrowException() {
            // given
            CategoryServiceUpdateReq request = CategoryServiceUpdateReq.builder()
                    .categoryName("수정된 카테고리")
                    .categoryType(CategoryType.INCOME)
                    .description("수정된 카테고리 설명")
                    .userEmail("다른이메일")
                    .categoryId(1L)
                    .build();

            // when, then
            assertThatThrownBy(() -> categoryService.update(request))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.CATEGORY_BOOK_FORBIDDEN.getMessage());
        }

        @DisplayName("삭제 - 카테고리 삭제 시 카테고리를 찾을 수 없으면 예외가 발생한다")
        @Test
        void whenDeleteCategoryWithNotFoundCategory_thenThrowException() {
            // given
            Long categoryId = 9999999L;
            String userEmail = "테스트이메일";

            // when, then
            assertThatThrownBy(() -> categoryService.delete(categoryId, userEmail))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.CATEGORY_NOT_FOUND.getMessage());
        }

        @DisplayName("삭제 - 카테고리 삭제 시 사용자 이메일이 다르면 예외가 발생한다")
        @Test
        void whenDeleteCategoryWithDifferentUserEmail_thenThrowException() {
            // given
            Long categoryId = categoryRepository.findByCategoryCode("테스트코드").get().id();
            String userEmail = "다른이메일";

            // when, then
            assertThatThrownBy(() -> categoryService.delete(categoryId, userEmail))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.CATEGORY_BOOK_FORBIDDEN.getMessage());
        }

        @DisplayName("조회 - 카테고리 조회 시 카테고리를 찾을 수 없으면 예외가 발생한다")
        @Test
        void whenGetCategoryByIdWithNotFoundCategory_thenThrowException() {
            // given
            Long categoryId = 99999999L;

            // when, then
            assertThatThrownBy(() -> categoryService.getCategoryById(categoryId))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.CATEGORY_NOT_FOUND.getMessage());
        }

        @DisplayName("조회 - 카테고리 조회 시 카테고리를 찾을 수 없으면 예외가 발생한다")
        @Test
        void whenGetCategoryByCodeWithNotFoundCategory_thenThrowException() {
            // given
            String categoryCode = "없는코드";

            // when, then
            assertThatThrownBy(() -> categoryService.getCategoryByCode(categoryCode))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.CATEGORY_NOT_FOUND.getMessage());
        }
    }
}
