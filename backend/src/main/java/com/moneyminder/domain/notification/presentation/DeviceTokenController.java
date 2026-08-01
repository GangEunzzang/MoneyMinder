package com.moneyminder.domain.notification.presentation;

import com.moneyminder.domain.notification.application.DeviceTokenService;
import com.moneyminder.domain.notification.presentation.dto.DeviceTokenRegisterReq;
import com.moneyminder.global.annotation.CurrentUserEmail;
import com.moneyminder.global.response.DataResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/device-tokens")
@RestController
public class DeviceTokenController {

    private final DeviceTokenService deviceTokenService;

    @PostMapping
    public DataResponse<Void> register(@CurrentUserEmail String email,
            @Valid @RequestBody DeviceTokenRegisterReq request) {
        deviceTokenService.register(email, request.token(), request.platform());

        return DataResponse.empty();
    }

    @DeleteMapping("/{token}")
    public DataResponse<Void> unregister(@CurrentUserEmail String email, @PathVariable String token) {
        deviceTokenService.unregister(email, token);

        return DataResponse.empty();
    }
}
