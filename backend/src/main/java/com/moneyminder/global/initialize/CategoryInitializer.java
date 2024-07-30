package com.moneyminder.global.initialize;

import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.repository.CategoryRepository;
import com.moneyminder.domain.category.domain.type.DefaultCategory;
import jakarta.annotation.PostConstruct;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Profile("!test")
@RequiredArgsConstructor
@Component
public class CategoryInitializer {

    private final CategoryRepository categoryRepository;


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
                .userEmail(Category.DEFAULT_USER_EMAIL)
                .build();
    }
}
