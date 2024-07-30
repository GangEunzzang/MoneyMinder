package com.moneyminder.global.response;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@RequiredArgsConstructor
@Getter
@ToString
public sealed class APIResponse permits DataResponse, ErrorResponse{

    private final Integer code;

    private final String message;

}
