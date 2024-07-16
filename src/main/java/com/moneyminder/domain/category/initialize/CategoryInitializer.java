package com.moneyminder.domain.category.initialize;

import com.moneyminder.domain.category.entity.Category;
import com.moneyminder.domain.category.repository.CategoryRepository;
import com.moneyminder.domain.category.type.DefaultCategory;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@RequiredArgsConstructor
@Component
public class CategoryInitializer {

    private final CategoryRepository categoryRepository;

    @PostConstruct
    @Transactional
    public void initialize() {
        Arrays.stream(DefaultCategory.values())
                .filter(defaultCategory -> !categoryRepository.existsByCategoryName(defaultCategory.getDescription()))
                .map(defaultCategory -> Category.of(defaultCategory.getDescription(), defaultCategory.getCategoryType(), false))
                .forEach(categoryRepository::save);
    }
}
