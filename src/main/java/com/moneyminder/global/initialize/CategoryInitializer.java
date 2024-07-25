package com.moneyminder.global.initialize;

import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.repository.CategoryRepository;
import com.moneyminder.domain.category.domain.type.DefaultCategory;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@RequiredArgsConstructor
@Component
public class CategoryInitializer {

    private final CategoryRepository categoryRepository;

    private static final String DEFAULT_USER_EMAIL = "DEFAULT_CATEGORY";

    @PostConstruct
    @Transactional
    public void initialize() {
        Arrays.stream(DefaultCategory.values())
                .filter(defaultCategory -> !categoryRepository.existsByCategoryCode(defaultCategory.getCategoryCode()))
                .map(this::createDefaultCategory)
                .forEach(categoryRepository::save);
    }

    private Category createDefaultCategory(DefaultCategory defaultCategory) {
        return Category.builder()
                .categoryType(defaultCategory.getCategoryType())
                .categoryName(defaultCategory.getCategoryName())
                .categoryCode(defaultCategory.getCategoryCode())
                .description(defaultCategory.getCategoryName())
                .isCustom(false)
                .userEmail(DEFAULT_USER_EMAIL)
                .build();
    }
}
