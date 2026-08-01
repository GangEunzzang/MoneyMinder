package com.moneyminder;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Flyway baseline 을 손으로 쓰면 ddl-auto=validate 가 미묘한 타입 차이로 깨진다.
 * 엔티티에서 MySQL DDL 을 직접 뽑을 때만 실행한다.
 */
@Disabled("baseline 을 다시 뽑을 때만 수동 실행")
@SpringBootTest(properties = {
        "spring.jpa.hibernate.ddl-auto=none",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect",
        "spring.jpa.properties.jakarta.persistence.schema-generation.scripts.action=create",
        "spring.jpa.properties.jakarta.persistence.schema-generation.scripts.create-target=build/schema-mysql.sql",
        "spring.flyway.enabled=false"
})
class SchemaExporter {

    @Test
    void exportMySqlSchema() {
    }
}
