package com.moneyminder.domain.mission;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moneyminder.domain.mission.domain.Mission;
import com.moneyminder.domain.mission.domain.type.MissionPeriod;
import com.moneyminder.global.exception.BaseException;
import java.time.LocalDate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class MissionTest {

    private Mission 무지출(MissionPeriod period) {
        return Mission.start("테스트이메일", "no-spend", 4, period, LocalDate.of(2026, 3, 1));
    }

    @Nested
    class 회차키 {

        @DisplayName("주간 미션은 같은 주면 같은 키를 준다.")
        @Test
        void whenSameWeek_thenSameKey() {
            Mission mission = 무지출(MissionPeriod.WEEK);

            String monday = mission.periodKeyOf(LocalDate.of(2026, 3, 2));
            String friday = mission.periodKeyOf(LocalDate.of(2026, 3, 6));
            String nextWeek = mission.periodKeyOf(LocalDate.of(2026, 3, 10));

            assertThat(monday).isEqualTo(friday);
            assertThat(monday).isNotEqualTo(nextWeek);
        }

        @DisplayName("월간 미션은 달이 바뀌면 키가 바뀐다.")
        @Test
        void whenMonthChanges_thenKeyChanges() {
            Mission mission = 무지출(MissionPeriod.MONTH);

            assertThat(mission.periodKeyOf(LocalDate.of(2026, 3, 31)))
                    .isNotEqualTo(mission.periodKeyOf(LocalDate.of(2026, 4, 1)));
        }

        @DisplayName("계속되는 미션은 회차가 하나뿐이다.")
        @Test
        void whenForever_thenSingleKey() {
            Mission mission = 무지출(MissionPeriod.FOREVER);

            assertThat(mission.periodKeyOf(LocalDate.of(2026, 3, 1)))
                    .isEqualTo(mission.periodKeyOf(LocalDate.of(2027, 9, 30)));
        }
    }

    @Nested
    class 진행 {

        @DisplayName("목표에 닿으면 달성이다.")
        @Test
        void whenProgressReachesTarget_thenAchieved() {
            Mission mission = 무지출(MissionPeriod.WEEK);

            assertThat(mission.isAchievedBy(3)).isFalse();
            assertThat(mission.isAchievedBy(4)).isTrue();
            assertThat(mission.isAchievedBy(5)).isTrue();
        }

        @DisplayName("멈춘 미션은 다시 켤 수 있다.")
        @Test
        void whenStopped_thenResumable() {
            Mission mission = 무지출(MissionPeriod.WEEK);

            mission.stop();
            assertThat(mission.isActive()).isFalse();

            mission.resume();
            assertThat(mission.isActive()).isTrue();
        }

        @DisplayName("목표가 0 이하면 만들 수 없다.")
        @Test
        void whenTargetNotPositive_thenThrow() {
            assertThatThrownBy(() -> Mission.start("테스트이메일", "no-spend", 0, MissionPeriod.WEEK, LocalDate.now()))
                    .isInstanceOf(BaseException.class);
        }
    }
}
