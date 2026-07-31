package com.moneyminder.domain.mission.application.dto.request;

import com.moneyminder.domain.mission.domain.type.MissionPeriod;
import lombok.Builder;

@Builder
public record MissionServiceUpdateReq(
        Long missionId,
        String userEmail,
        int target,
        MissionPeriod period
) {
}
