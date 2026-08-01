package com.moneyminder.domain.mission.application.dto.response;

import com.moneyminder.domain.mission.domain.Mission;
import com.moneyminder.domain.mission.domain.type.MissionPeriod;
import com.moneyminder.domain.mission.domain.type.MissionStatus;
import java.time.LocalDate;
import lombok.Builder;

@Builder
public record MissionServiceRes(
        Long missionId,
        String missionCode,
        int target,
        MissionPeriod period,
        LocalDate startedOn,
        MissionStatus status,
        String currentPeriodKey
) {

    public static MissionServiceRes fromDomain(Mission mission, LocalDate today) {
        return MissionServiceRes.builder()
                .missionId(mission.getId())
                .missionCode(mission.getMissionCode())
                .target(mission.getTarget())
                .period(mission.getPeriod())
                .startedOn(mission.getStartedOn())
                .status(mission.getStatus())
                .currentPeriodKey(mission.periodKeyOf(today))
                .build();
    }
}
