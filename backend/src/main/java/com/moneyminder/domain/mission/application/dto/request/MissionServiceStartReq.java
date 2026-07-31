package com.moneyminder.domain.mission.application.dto.request;

import com.moneyminder.domain.mission.domain.type.MissionPeriod;
import lombok.Builder;

@Builder
public record MissionServiceStartReq(
        String userEmail,
        String missionCode,
        int target,
        MissionPeriod period
) {
}
