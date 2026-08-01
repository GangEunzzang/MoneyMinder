package com.moneyminder.domain.mission.domain;

import com.moneyminder.domain.mission.domain.type.MissionPeriod;
import com.moneyminder.domain.mission.domain.type.MissionStatus;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;
import org.springframework.util.Assert;

/**
 * 미션의 제목·단위·세는 대상은 앱이 갖고 있는 스펙이다. 서버는 사용자가 무엇을
 * 얼마나 하기로 했는지와 그 진행 상태만 안다.
 */
@Getter
public class Mission {

    private final Long id;
    private final String userEmail;
    private final String missionCode;
    private final LocalDate startedOn;
    private int target;
    private MissionPeriod period;
    private MissionStatus status;

    @Builder
    private Mission(Long id, String userEmail, String missionCode, int target, MissionPeriod period,
            LocalDate startedOn, MissionStatus status) {
        Assert.hasText(userEmail, "userEmail must not be empty");
        Assert.hasText(missionCode, "missionCode must not be empty");
        Assert.notNull(period, "period must not be null");
        Assert.notNull(startedOn, "startedOn must not be null");

        this.id = id;
        this.userEmail = userEmail;
        this.missionCode = missionCode;
        this.target = validateTarget(target);
        this.period = period;
        this.startedOn = startedOn;
        this.status = status == null ? MissionStatus.ACTIVE : status;
    }

    public static Mission start(String userEmail, String missionCode, int target, MissionPeriod period,
            LocalDate startedOn) {
        return Mission.builder()
                .userEmail(userEmail)
                .missionCode(missionCode)
                .target(target)
                .period(period)
                .startedOn(startedOn)
                .status(MissionStatus.ACTIVE)
                .build();
    }

    public void changeGoal(int target, MissionPeriod period) {
        Assert.notNull(period, "period must not be null");

        this.target = validateTarget(target);
        this.period = period;
    }

    public void stop() {
        this.status = MissionStatus.STOPPED;
    }

    public void resume() {
        this.status = MissionStatus.ACTIVE;
    }

    public boolean isActive() {
        return MissionStatus.ACTIVE.equals(status);
    }

    public boolean isOwnedBy(String email) {
        return userEmail.equals(email);
    }

    public void validateOwner(String email) {
        if (!isOwnedBy(email)) {
            throw new BaseException(ResultCode.MISSION_FORBIDDEN);
        }
    }

    /**
     * 완주는 회차가 닫힌 뒤에도 계속 참이라, 회차 키를 남기지 않으면 열 때마다 같은 축하가 다시 뜬다.
     */
    public String periodKeyOf(LocalDate date) {
        return period.periodKeyOf(date);
    }

    public boolean isAchievedBy(int progress) {
        return progress >= target;
    }

    private int validateTarget(int target) {
        if (target < 1) {
            throw new BaseException(ResultCode.MISSION_INVALID_TARGET);
        }

        return target;
    }
}
