package com.moneyminder.domain.mission.presentation.dto;

import com.moneyminder.domain.mission.application.dto.request.MissionServiceStartReq;
import com.moneyminder.domain.mission.domain.type.MissionPeriod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record MissionStartReq(

        @NotBlank
        String missionCode,

        @Min(1)
        int target,

        @NotNull
        MissionPeriod period
) {

    public MissionServiceStartReq toService(String email) {
        return MissionServiceStartReq.builder()
                .userEmail(email)
                .missionCode(missionCode)
                .target(target)
                .period(period)
                .build();
    }
}
