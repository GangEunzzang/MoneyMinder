package com.moneyminder.domain.category.Infrastructure.jpa.converter;

import com.moneyminder.domain.category.domain.type.CategoryType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.stereotype.Component;

@Component
@Converter
public class CategoryTypeConverter implements AttributeConverter<CategoryType, String> {

    @Override
    public String convertToDatabaseColumn(CategoryType categoryType) {
        return categoryType.getDbCode();
    }

    @Override
    public CategoryType convertToEntityAttribute(String dbData) {
        return CategoryType.fromDbCode(dbData);
    }
}
