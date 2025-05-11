package com.moneyminder.user.feign;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserApiResponse<T> {

    private int code;
    private String message;
    private T data;

    public UserApiResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public UserApiResponse(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public boolean isSuccess() {
        return code == 200;
    }
}
