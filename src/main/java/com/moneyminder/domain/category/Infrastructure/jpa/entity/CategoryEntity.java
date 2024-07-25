package com.moneyminder.domain.category.Infrastructure.jpa.entity;

import com.moneyminder.domain.category.Infrastructure.jpa.converter.CategoryTypeConverter;
import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.type.CategoryType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "category")
public class CategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    @Comment("카테고리 고유 식별자")
    private Long id;

    @Comment("카테고리 이름")
    private String categoryName;

    @Column(unique = true, nullable = false, length = 30)
    @Comment("카테고리 코드")
    private String categoryCode;

    @Convert(converter = CategoryTypeConverter.class)
    @Comment("카테고리 유형 (수입 또는 지출)")
    private CategoryType categoryType;

    @Comment("사용자 정의 여부")
    private boolean isCustom;

    @Comment("유저 이메일")
    private String userEmail;

    @Comment("카테고리 설명")
    private String description;

    @Builder
    private CategoryEntity(Long id, String categoryName, String categoryCode, CategoryType categoryType, boolean isCustom, String userEmail, String description) {
        this.id = id;
        this.categoryName = categoryName;
        this.categoryCode = categoryCode;
        this.categoryType = categoryType;
        this.isCustom = isCustom;
        this.userEmail = userEmail;
        this.description = description;
    }

    public Category toDomain() {
        return Category.builder()
                .id(id)
                .categoryName(categoryName)
                .categoryCode(categoryCode)
                .categoryType(categoryType)
                .isCustom(isCustom)
                .userEmail(userEmail)
                .description(description)
                .build();
    }
}



