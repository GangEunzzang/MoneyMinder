package com.moneyminder.domain.category.presentation;

import com.moneyminder.domain.category.application.CategoryService;
import com.moneyminder.domain.category.application.dto.request.CategoryServiceCreateReq;
import com.moneyminder.domain.category.application.dto.request.CategoryServiceUpdateReq;
import com.moneyminder.domain.category.application.dto.response.CategoryServiceRes;
import com.moneyminder.domain.category.presentation.dto.request.CategoryCreateReq;
import com.moneyminder.domain.category.presentation.dto.request.CategoryUpdateReq;
import com.moneyminder.global.annotaion.CurrentUserEmail;
import com.moneyminder.global.response.APIResponse;
import com.moneyminder.global.response.DataResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/api/v1/categories")
@RestController
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/create")
    public DataResponse<CategoryServiceRes> createCategory(@CurrentUserEmail String email, @RequestBody @Valid CategoryCreateReq request) {
        CategoryServiceCreateReq serviceRequest = request.toService(email);
        CategoryServiceRes response = categoryService.create(serviceRequest);

        return DataResponse.of(response);
    }

    @PutMapping("/update")
    public DataResponse<CategoryServiceRes> updateCategory(@CurrentUserEmail String email, @RequestBody @Valid CategoryUpdateReq request) {
        CategoryServiceUpdateReq serviceRequest = request.toService(email);
        CategoryServiceRes response = categoryService.update(serviceRequest);

        return DataResponse.of(response);
    }

    @DeleteMapping("/delete/{categoryId}")
    public APIResponse deleteCategory(@CurrentUserEmail String email, @PathVariable Long categoryId) {
        categoryService.delete(categoryId, email);

        return DataResponse.empty();
    }

    @GetMapping("/id/{categoryId}")
    public DataResponse<CategoryServiceRes> findByCategoryId(@PathVariable Long categoryId) {
        CategoryServiceRes response = categoryService.getById(categoryId);

        return DataResponse.of(response);
    }

    @GetMapping("/email")
    public DataResponse<List<CategoryServiceRes>> findByUserEmail(@CurrentUserEmail String email) {
        List<CategoryServiceRes> responses = categoryService.getByUserEmailAndDefaultCategories(email);

        return DataResponse.of(responses);
    }
}