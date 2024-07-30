package com.moneyminder.domain.category.application;

import com.moneyminder.domain.category.application.dto.request.CategoryServiceCreateReq;
import com.moneyminder.domain.category.application.dto.request.CategoryServiceUpdateReq;
import com.moneyminder.domain.category.application.dto.response.CategoryServiceRes;
import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.repository.CategoryRepository;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Stream;

@Slf4j
@RequiredArgsConstructor
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public CategoryServiceRes create(CategoryServiceCreateReq request) {
        Category category = categoryRepository.save(Category.create(request));
        return CategoryServiceRes.fromDomain(category);
    }

    @Transactional
    public CategoryServiceRes update(CategoryServiceUpdateReq request) {
        Category category = categoryRepository.getById(request.categoryId());

        if (!category.userEmail().equals(request.userEmail())) {
            throw new BaseException(ResultCode.CATEGORY_BOOK_FORBIDDEN);
        }

        Category updateCategory = category.update(request);
        categoryRepository.save(updateCategory);

        return CategoryServiceRes.fromDomain(updateCategory);
    }

    @Transactional
    public void delete(Long categoryId, String userEmail) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BaseException(ResultCode.CATEGORY_NOT_FOUND));

        if (!category.userEmail().equals(userEmail)) {
            throw new BaseException(ResultCode.CATEGORY_BOOK_FORBIDDEN);
        }

        categoryRepository.delete(category);
    }

    @Transactional(readOnly = true)
    public List<CategoryServiceRes> getByUserEmailAndDefaultCategories(String email) {
        List<CategoryServiceRes> defaultCategories = getDefaultCategories();
        List<CategoryServiceRes> userCategories = getCategoriesByEmail(email);

        return Stream.concat(defaultCategories.stream(), userCategories.stream()).toList();
    }

    public CategoryServiceRes getById(Long categoryId) {
        Category category = categoryRepository.getById(categoryId);

        return CategoryServiceRes.fromDomain(category);
    }

    public CategoryServiceRes getCategoryByCode(String categoryCode) {
        Category category = categoryRepository.getByCategoryCode(categoryCode);

        return CategoryServiceRes.fromDomain(category);
    }

    public List<CategoryServiceRes> getDefaultCategories() {
        return categoryRepository.findByDefaultCategory().stream()
                .map(CategoryServiceRes::fromDomain)
                .toList();
    }

    public List<CategoryServiceRes> getCategoriesByEmail(String email) {
        return categoryRepository.findByUserEmail(email).stream()
                .map(CategoryServiceRes::fromDomain)
                .toList();
    }

}