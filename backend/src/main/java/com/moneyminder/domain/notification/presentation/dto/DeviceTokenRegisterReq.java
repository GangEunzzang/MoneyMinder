package com.moneyminder.domain.notification.presentation.dto;

import com.moneyminder.domain.notification.domain.type.DevicePlatform;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record DeviceTokenRegisterReq(

        @NotBlank
        String token,

        @NotNull
        DevicePlatform platform
) {
}
