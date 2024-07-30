package com.moneyminder.domain.category.domain.repository;

import com.moneyminder.domain.category.domain.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository {

    Category getById(Long id);

    List<Category> findAll();

    Optional<Category> findById(Long id);

    Optional<Category> findByCategoryCode(String categoryCode);

    Category getByCategoryCode(String categoryCode);

    Category save(Category category);

    boolean existsByCategoryName(String categoryName);

    boolean existsByCategoryCode(String categoryCode);

    List<Category> findByDefaultCategory();

    List<Category> findByUserEmail(String email);

    void delete(Category category);

    void deleteAllInBatch();
}
