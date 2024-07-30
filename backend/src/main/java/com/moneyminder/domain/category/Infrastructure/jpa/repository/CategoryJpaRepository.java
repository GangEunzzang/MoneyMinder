package com.moneyminder.domain.category.Infrastructure.jpa.repository;

import com.moneyminder.domain.category.Infrastructure.jpa.entity.CategoryEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryJpaRepository extends JpaRepository<CategoryEntity, Long> {

    boolean existsByCategoryName(String categoryName);

    Optional<CategoryEntity> findByCategoryCode(String categoryCode);

    boolean existsByCategoryCode(String categoryCode);

    List<CategoryEntity> findByIsCustom(boolean isCustom);

    List<CategoryEntity> findByUserEmail(String email);
}