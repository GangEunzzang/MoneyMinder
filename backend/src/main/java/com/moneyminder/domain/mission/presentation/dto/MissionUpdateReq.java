package com.moneyminder.domain.mission.presentation.dto;

import com.moneyminder.domain.mission.application.dto.request.MissionServiceUpdateReq;
import com.moneyminder.domain.mission.domain.type.MissionPeriod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record MissionUpdateReq(

        @Min(1)
        int target,

        @NotNull
        MissionPeriod period
) {

    public MissionServiceUpdateReq toService(Long missionId, String email) {
        return MissionServiceUpdateReq.builder()
                .missionId(missionId)
                .userEmail(email)
                .target(target)
                .period(period)
                .build();
    }
}
