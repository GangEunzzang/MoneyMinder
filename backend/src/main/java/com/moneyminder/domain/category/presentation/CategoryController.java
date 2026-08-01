package com.moneyminder.domain.category.presentation;

import com.moneyminder.domain.category.application.CategoryService;
import com.moneyminder.domain.category.application.dto.response.CategoryServiceRes;
import com.moneyminder.domain.category.presentation.dto.CategoryCreateReq;
import com.moneyminder.domain.category.presentation.dto.CategoryUpdateReq;
import com.moneyminder.global.annotation.CurrentUserEmail;
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

    @PostMapping
    public DataResponse<CategoryServiceRes> create(@CurrentUserEmail String email,
            @Valid @RequestBody CategoryCreateReq request) {
        return DataResponse.of(categoryService.create(request.toService(email)));
    }

    @PutMapping("/{categoryId}")
    public DataResponse<CategoryServiceRes> update(@CurrentUserEmail String email, @PathVariable Long categoryId,
            @Valid @RequestBody CategoryUpdateReq request) {
        return DataResponse.of(categoryService.update(request.toService(categoryId, email)));
    }

    @DeleteMapping("/{categoryId}")
    public DataResponse<Void> delete(@CurrentUserEmail String email, @PathVariable Long categoryId) {
        categoryService.delete(categoryId, email);

        return DataResponse.empty();
    }

    @GetMapping("/{categoryId}")
    public DataResponse<CategoryServiceRes> getById(@PathVariable Long categoryId) {
        return DataResponse.of(categoryService.getById(categoryId));
    }

    /**
     * 내가 만든 카테고리와 기본 카테고리를 함께 준다.
     */
    @GetMapping
    public DataResponse<List<CategoryServiceRes>> getMine(@CurrentUserEmail String email) {
        return DataResponse.of(categoryService.getByUserEmailAndDefaultCategories(email));
    }
}
