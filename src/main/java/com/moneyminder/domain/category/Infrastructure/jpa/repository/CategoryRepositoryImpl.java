package com.moneyminder.domain.category.Infrastructure.jpa.repository;

import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.Infrastructure.jpa.entity.CategoryEntity;
import com.moneyminder.domain.category.domain.repository.CategoryRepository;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Repository
public class CategoryRepositoryImpl implements CategoryRepository {

    private final CategoryJpaRepository jpaRepository;

    @Override
    public Category getById(Long id) {
        return findById(id).orElseThrow(() -> new BaseException(ResultCode.CATEGORY_NOT_FOUND));
    }

    @Override
    public List<Category> findAll() {
        return jpaRepository.findAll().stream()
                .map(CategoryEntity::toDomain)
                .toList();
    }

    @Override
    public Optional<Category> findById(Long id) {
        return jpaRepository.findById(id)
                .map(CategoryEntity::toDomain);
    }

    @Override
    public Optional<Category> findByCategoryCode(String categoryCode) {
        return jpaRepository.findByCategoryCode(categoryCode)
                .map(CategoryEntity::toDomain);
    }

    @Override
    public Category save(Category category) {
        return jpaRepository.save(category.toEntity()).toDomain();
    }

    @Override
    public boolean existsByCategoryName(String categoryName) {
        return jpaRepository.existsByCategoryName(categoryName);
    }

    @Override
    public boolean existsByCategoryCode(String categoryCode) {
        return jpaRepository.existsByCategoryCode(categoryCode);
    }

    @Override
    public List<Category> findByDefaultCategory() {
        return jpaRepository.findByIsCustom(false).stream()
                .map(CategoryEntity::toDomain)
                .toList();
    }

    @Override
    public List<Category> findByUserEmail(String email) {
        return jpaRepository.findByUserEmail(email).stream()
                .map(CategoryEntity::toDomain)
                .toList();
    }

    @Override
    public void delete(Category category) {
        jpaRepository.delete(category.toEntity());
    }

    @Override
    public void deleteAllInBatch() {
        jpaRepository.deleteAllInBatch();
    }
}
