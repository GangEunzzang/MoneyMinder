package com.moneyminder.domain.user.domain.type;

import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum UserRole {

    GUEST("ROLE_GUEST", "손님"),
    USER("ROLE_USER", "사용자"),
    ADMIN("ROLE_ADMIN", "관리자");

    private final String key;
    private final String description;

    public static UserRole fromKey(String key) {
        for (UserRole role : UserRole.values()) {
            if (role.getKey().equals(key)) {
                return role;
            }
        }
        throw new BaseException(
                ResultCode.NOT_FOUND_ROLE,
                ResultCode.NOT_FOUND_ROLE.getMessage() + " key: " + key
        );
    }

    public static UserRole fromKey(Object key) {
        key = String.valueOf(key);
        for (UserRole role : UserRole.values()) {
            if (role.getKey().equals(key)) {
                return role;
            }
        }
        throw new BaseException(
                ResultCode.NOT_FOUND_ROLE,
                ResultCode.NOT_FOUND_ROLE.getMessage() + " key: " + key
        );
    }
}
