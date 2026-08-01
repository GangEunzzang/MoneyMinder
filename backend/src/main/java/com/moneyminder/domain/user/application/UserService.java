package com.moneyminder.domain.user.application;

import com.moneyminder.domain.auth.application.JwtProvider;
import com.moneyminder.domain.auth.domain.TokenInfo;
import com.moneyminder.domain.user.application.dto.request.UserServiceLoginReq;
import com.moneyminder.domain.user.application.dto.request.UserServiceSignupReq;
import com.moneyminder.domain.user.domain.User;
import com.moneyminder.domain.user.domain.repository.UserRepository;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TokenInfo login(UserServiceLoginReq loginReq) {
        User user = userRepository.findByEmail(loginReq.email())
                .orElseThrow(() -> new BaseException(ResultCode.USER_NOT_FOUND));

        user.validatePassword(loginReq.password(), passwordEncoder::matches);

        return jwtProvider.generateToken(user);
    }

    public void signup(UserServiceSignupReq signupReq) {
        userRepository.save(signupReq.toDomain());
    }

}
