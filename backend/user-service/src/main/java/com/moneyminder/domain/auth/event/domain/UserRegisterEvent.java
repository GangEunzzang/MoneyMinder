package com.moneyminder.domain.auth.event.domain;

import jakarta.validation.constraints.NotNull;
import org.springframework.validation.annotation.Validated;

@Validated
public record UserRegisterEvent(
        @NotNull
        String email,

        @NotNull
        String name
) {

}
