package com.moneyminder.domain.mission.domain.type;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.Locale;

public enum MissionPeriod {

    WEEK {
        @Override
        public String periodKeyOf(LocalDate date) {
            WeekFields weekFields = WeekFields.of(Locale.KOREA);

            return "%d-W%02d".formatted(date.get(weekFields.weekBasedYear()), date.get(weekFields.weekOfWeekBasedYear()));
        }
    },
    MONTH {
        @Override
        public String periodKeyOf(LocalDate date) {
            return "%d-%02d".formatted(date.getYear(), date.getMonthValue());
        }
    },
    FOREVER {
        @Override
        public String periodKeyOf(LocalDate date) {
            return "all";
        }
    };

    /**
     * 이 회차를 가리키는 키. 같은 회차를 두 번 축하하지 않으려면 회차에 이름이 있어야 한다.
     */
    public abstract String periodKeyOf(LocalDate date);
}
