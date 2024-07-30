package com.moneyminder;

import com.moneyminder.domain.auth.application.JwtProvider;
import com.moneyminder.domain.user.domain.type.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AuthHelper {

    private static JwtProvider jwtProvider;

    @Autowired
    public AuthHelper(JwtProvider jwtProvider) {
        AuthHelper.jwtProvider = jwtProvider;
    }

    public static String getAccessToken() {
        return jwtProvider.generateToken("TestUser", UserRole.USER).accessToken();
    }
}
