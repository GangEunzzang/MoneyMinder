package com.moneyminder.domain.recurring;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moneyminder.domain.recurring.domain.Recurring;
import com.moneyminder.global.exception.BaseException;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.YearMonth;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class RecurringTest {

    private Recurring 매월(int cycleDay) {
        return Recurring.create("테스트이메일", "넷플릭스", BigInteger.valueOf(13_500), cycleDay, "카테고리코드", null, true, 3);
    }

    @Nested
    class 결제일 {

        @DisplayName("31일로 걸어둔 항목은 2월에 말일로 당겨진다.")
        @Test
        void whenMonthIsShorter_thenClampToLastDay() {
            Recurring recurring = 매월(31);

            assertThat(recurring.billingDateOf(YearMonth.of(2026, 2))).isEqualTo(LocalDate.of(2026, 2, 28));
            assertThat(recurring.billingDateOf(YearMonth.of(2024, 2))).isEqualTo(LocalDate.of(2024, 2, 29));
            assertThat(recurring.billingDateOf(YearMonth.of(2026, 1))).isEqualTo(LocalDate.of(2026, 1, 31));
        }

        @DisplayName("이번 달 결제일이 지났으면 다음 결제일은 다음 달이다.")
        @Test
        void whenThisMonthPassed_thenNextMonth() {
            Recurring recurring = 매월(5);

            assertThat(recurring.nextBillingDate(LocalDate.of(2026, 3, 10)))
                    .isEqualTo(LocalDate.of(2026, 4, 5));
        }

        @DisplayName("결제일 당일은 아직 지나지 않은 것으로 본다.")
        @Test
        void whenToday_thenNotPassed() {
            Recurring recurring = 매월(5);

            assertThat(recurring.nextBillingDate(LocalDate.of(2026, 3, 5))).isEqualTo(LocalDate.of(2026, 3, 5));
            assertThat(recurring.daysUntilBilling(LocalDate.of(2026, 3, 5))).isZero();
            assertThat(recurring.isSettledThisMonth(LocalDate.of(2026, 3, 5))).isFalse();
        }
    }

    @Nested
    class 자동기록 {

        @DisplayName("결제일이 지나면 기록 대상이 된다.")
        @Test
        void whenBillingDatePassed_thenShouldRecord() {
            assertThat(매월(5).shouldAutoRecord(LocalDate.of(2026, 3, 6))).isTrue();
        }

        @DisplayName("결제일 전에는 기록하지 않는다.")
        @Test
        void whenBeforeBillingDate_thenSkip() {
            assertThat(매월(20).shouldAutoRecord(LocalDate.of(2026, 3, 6))).isFalse();
        }

        @DisplayName("이번 달에 이미 기록했으면 다시 하지 않는다.")
        @Test
        void whenAlreadyRecordedThisMonth_thenSkip() {
            Recurring recurring = 매월(5);
            recurring.markRecorded(YearMonth.of(2026, 3));

            assertThat(recurring.shouldAutoRecord(LocalDate.of(2026, 3, 6))).isFalse();
        }

        @DisplayName("지난달에 기록했어도 이번 달은 다시 기록한다.")
        @Test
        void whenRecordedLastMonth_thenRecordAgain() {
            Recurring recurring = 매월(5);
            recurring.markRecorded(YearMonth.of(2026, 2));

            assertThat(recurring.shouldAutoRecord(LocalDate.of(2026, 3, 6))).isTrue();
        }

        @DisplayName("자동기록을 꺼두면 결제일이 지나도 기록하지 않는다.")
        @Test
        void whenAutoRecordOff_thenSkip() {
            Recurring recurring = Recurring.create("테스트이메일", "넷플릭스", BigInteger.valueOf(13_500), 5, "카테고리코드",
                    null, false, 3);

            assertThat(recurring.shouldAutoRecord(LocalDate.of(2026, 3, 6))).isFalse();
        }
    }

    @Nested
    class 알림 {

        @DisplayName("결제 3일 전부터 알린다.")
        @Test
        void whenWithinRemindWindow_thenDue() {
            Recurring recurring = 매월(10);

            assertThat(recurring.dueForReminder(LocalDate.of(2026, 3, 7))).isTrue();
            assertThat(recurring.dueForReminder(LocalDate.of(2026, 3, 6))).isFalse();
        }

        @DisplayName("결제 당일은 알리지 않는다. 이미 빠져나갔다.")
        @Test
        void whenBillingDay_thenNotDue() {
            assertThat(매월(10).dueForReminder(LocalDate.of(2026, 3, 10))).isFalse();
        }

        @DisplayName("0일로 두면 알리지 않는다.")
        @Test
        void whenZero_thenNeverDue() {
            Recurring recurring = Recurring.create("테스트이메일", "넷플릭스", BigInteger.valueOf(13_500), 10, "카테고리코드",
                    null, true, 0);

            assertThat(recurring.dueForReminder(LocalDate.of(2026, 3, 8))).isFalse();
        }
    }

    @Nested
    class 검증 {

        @DisplayName("결제일이 1~31 밖이면 만들 수 없다.")
        @Test
        void whenCycleDayOutOfRange_thenThrow() {
            assertThatThrownBy(() -> 매월(0)).isInstanceOf(BaseException.class);
            assertThatThrownBy(() -> 매월(32)).isInstanceOf(BaseException.class);
        }

        @DisplayName("남의 고정지출은 건드릴 수 없다.")
        @Test
        void whenNotOwner_thenThrow() {
            assertThatThrownBy(() -> 매월(5).validateOwner("다른이메일")).isInstanceOf(BaseException.class);
        }
    }
}
