package com.moneyminder.global.util;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.Locale;

public class TimeUtils {

    /**
     * 해당 년도, 월의 주차를 반환합니다.
     *
     * @param year  년도
     * @param month 월
     */
    public static int getWeekOfMonth(int year, int month) {
        LocalDate firstDayOfMonth = LocalDate.of(year, month, 1);
        LocalDate lastDayOfMonth = firstDayOfMonth.withDayOfMonth(firstDayOfMonth.lengthOfMonth());

        int totalWeeks = lastDayOfMonth.get(WeekFields.of(Locale.getDefault()).weekOfMonth());

        return totalWeeks;
    }


    /**
     * 해당 년도, 월, 주차의 첫날과 마지막날을 반환합니다.
     *
     * @param year  년도
     * @param month 월
     * @param week  주차
     */
    public static LocalDate[] getFirstAndLastDayOfWeek(int year, int month, int week) {
        LocalDate firstDayOfMonth = LocalDate.of(year, month, 1);
        LocalDate firstDayOfWeek = firstDayOfMonth.with(DayOfWeek.MONDAY);

        int daysToAdd = (week - 1) * 7;
        LocalDate startOfWeek = firstDayOfWeek.plusDays(daysToAdd);
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        if (startOfWeek.getMonthValue() != month) {
            startOfWeek = LocalDate.of(year, month, 1);
        }

        if (endOfWeek.getMonthValue() != month) {
            endOfWeek = LocalDate.of(year, month, LocalDate.of(year, month, 1).lengthOfMonth());
        }

        return new LocalDate[]{startOfWeek, endOfWeek};
    }

}
