package com.moneyminder.user.application;

import com.moneyminder.auth.application.AuthService;
import com.moneyminder.auth.domain.TokenInfo;
import com.moneyminder.dto.JwtClaims;
import com.moneyminder.exception.BaseException;
import com.moneyminder.exception.ResultCode;
import com.moneyminder.user.application.dto.request.UserLoginReq;
import com.moneyminder.user.application.dto.request.UserSignupReq;
import com.moneyminder.user.domain.User;
import com.moneyminder.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TokenInfo login(UserLoginReq loginReq) {
        User user = userRepository.findByEmail(loginReq.email())
                .orElseThrow(() -> new BaseException(ResultCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(loginReq.password(), user.password())) {
            throw new BaseException(ResultCode.INVALID_PASSWORD);
        }

        JwtClaims claims = JwtClaims.create(user.email(), user.userRole().getKey(), user.name());

        return authService.generateToken(claims);
    }

    public void signup(UserSignupReq signupReq) {
        userRepository.save(signupReq.toDomain());
    }

}
