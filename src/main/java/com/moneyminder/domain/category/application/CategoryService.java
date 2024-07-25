package com.moneyminder.domain.category.application;

import com.moneyminder.domain.category.application.dto.CategoryServiceCreateReq;
import com.moneyminder.domain.category.application.dto.CategoryServiceUpdateReq;
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
    public Category create(CategoryServiceCreateReq request) {
        return categoryRepository.save(Category.create(request));
    }

    @Transactional
    public Category update(CategoryServiceUpdateReq request) {
        Category category = categoryRepository.getById(request.categoryId());

        if (!category.userEmail().equals(request.userEmail())) {
            throw new BaseException(ResultCode.CATEGORY_BOOK_FORBIDDEN);
        }

        Category updateCategory = category.update(request);
        return categoryRepository.save(updateCategory);
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
    public List<Category> getCategoriesForUser(String email) {
        List<Category> defaultCategories = getDefaultCategories();
        List<Category> userCategories = getCategoriesByEmail(email);

        return Stream.concat(defaultCategories.stream(), userCategories.stream()).toList();
    }

    public Category getCategoryById(Long categoryId) {
        return categoryRepository.getById(categoryId);
    }

    public Category getCategoryByCode(String categoryCode) {
        return categoryRepository.findByCategoryCode(categoryCode)
                .orElseThrow(() -> new BaseException(ResultCode.CATEGORY_NOT_FOUND));
    }

    public List<Category> getDefaultCategories() {
        return categoryRepository.findByDefaultCategory();
    }

    public List<Category> getCategoriesByEmail(String email) {
        return categoryRepository.findByUserEmail(email);
    }

}