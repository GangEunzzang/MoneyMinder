package com.moneyminder.domain.category.presentation;

import com.moneyminder.domain.category.application.CategoryService;
import com.moneyminder.domain.category.application.dto.CategoryServiceCreateReq;
import com.moneyminder.domain.category.application.dto.CategoryServiceUpdateReq;
import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.presentation.dto.request.CategoryCreateReq;
import com.moneyminder.domain.category.presentation.dto.request.CategoryUpdateRequest;
import com.moneyminder.domain.category.presentation.dto.response.CategoryResponse;
import com.moneyminder.global.annotaion.CurrentUserEmail;
import com.moneyminder.global.response.APIResponse;
import com.moneyminder.global.response.DataResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/v1/api/categories")
@RestController
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/create")
    public DataResponse<CategoryResponse> createCategory(@CurrentUserEmail String email, @RequestBody @Valid CategoryCreateReq request) {
        CategoryServiceCreateReq serviceRequest = request.toService(email);
        Category category = categoryService.create(serviceRequest);
        CategoryResponse response = CategoryResponse.fromDomain(category);

        return DataResponse.of(response);
    }

    @PutMapping("/update")
    public DataResponse<CategoryResponse> updateCategory(@CurrentUserEmail String email, @RequestBody @Valid CategoryUpdateRequest request) {
        CategoryServiceUpdateReq serviceRequest = request.toService(email);
        Category category = categoryService.update(serviceRequest);
        CategoryResponse response = CategoryResponse.fromDomain(category);

        return DataResponse.of(response);
    }

    @DeleteMapping("/delete/{categoryId}")
    public APIResponse deleteCategory(@CurrentUserEmail String email, @PathVariable Long categoryId) {
        categoryService.delete(categoryId, email);

        return DataResponse.empty();
    }

    @GetMapping("/id/{categoryId}")
    public DataResponse<CategoryResponse> findByCategoryId(@PathVariable Long categoryId) {
        Category category = categoryService.getCategoryById(categoryId);
        CategoryResponse response = CategoryResponse.fromDomain(category);

        return DataResponse.of(response);
    }

    @GetMapping("/email")
    public DataResponse<List<CategoryResponse>> findByUserEmail(@CurrentUserEmail String email) {
        List<Category> category = categoryService.getCategoriesForUser(email);

        List<CategoryResponse> responses = category.stream()
                .map(CategoryResponse::fromDomain)
                .toList();

        return DataResponse.of(responses);
    }
}