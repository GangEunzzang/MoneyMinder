package com.moneyminder;

import static org.assertj.core.api.Assertions.assertThat;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * 마이그레이션 SQL 은 운영 배포 때 처음 실행된다. 그때 문법이 틀리면 그대로 죽는다.
 * MySQL 컨테이너 없이도 최소한 실행은 되는지 여기서 확인한다.
 */
class FlywayBaselineTest {

    private static final String H2_MYSQL_MODE =
            "jdbc:h2:mem:flyway_baseline;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1";

    @DisplayName("baseline 이 실행되고 테이블 넷을 만든다.")
    @Test
    void baselineCreatesAllTables() throws Exception {
        Flyway.configure()
                .dataSource(H2_MYSQL_MODE, "sa", "")
                .locations("classpath:db/migration")
                .load()
                .migrate();

        assertThat(tableNames()).contains("users", "category", "account_book", "budget");
    }

    private List<String> tableNames() throws Exception {
        List<String> names = new ArrayList<>();

        try (Connection connection = DriverManager.getConnection(H2_MYSQL_MODE, "sa", "");
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery(
                        "select table_name from information_schema.tables "
                                + "where upper(table_schema) = 'PUBLIC'")) {

            while (resultSet.next()) {
                names.add(resultSet.getString(1).toLowerCase());
            }
        }

        return names;
    }
}
