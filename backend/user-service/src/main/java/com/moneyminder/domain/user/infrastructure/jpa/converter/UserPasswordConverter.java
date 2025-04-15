package com.moneyminder.domain.user.infrastructure.jpa.converter;

import jakarta.persistence.Converter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

@RequiredArgsConstructor
@Converter
public class UserPasswordConverter implements jakarta.persistence.AttributeConverter<String, String> {

    private final PasswordEncoder passwordEncoder;

    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) {
            return null;
        }

        return passwordEncoder.encode(attribute);
    }

    public String convertToEntityAttribute(String dbData) {
        return dbData;
    }

}
