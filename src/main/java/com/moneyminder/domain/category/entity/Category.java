package com.moneyminder.domain.category.entity;

import com.moneyminder.domain.category.type.CategoryType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import org.springframework.util.Assert;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    @Comment("카테고리 고유 식별자")
    private Long id;

    @Comment("카테고리 이름")
    private String categoryName;

    @Enumerated(EnumType.STRING)
    @Comment("카테고리 유형 (수입 또는 지출)")
    private CategoryType categoryType;

    @Comment("사용자 정의 여부")
    private boolean isCustom;

    @Builder
    private Category(String categoryName, CategoryType categoryType, boolean isCustom) {
        validate(categoryName, categoryType);
        this.categoryName = categoryName;
        this.categoryType = categoryType;
        this.isCustom = isCustom;
    }

    private void validate(String categoryName, CategoryType categoryType) {
        Assert.notNull(categoryName, "categoryName must not be empty");
        Assert.notNull(categoryType, "categoryType must not be empty");
    }

    public static Category of(String categoryName, CategoryType categoryType, boolean isCustom) {
        return Category.builder()
                .categoryName(categoryName)
                .categoryType(categoryType)
                .isCustom(isCustom)
                .build();
    }
}



