package com.moneyminder.domain.user.application;

import com.moneyminder.domain.auth.application.AuthService;
import com.moneyminder.domain.auth.domain.TokenInfo;
import com.moneyminder.domain.user.application.dto.request.UserLoginReq;
import com.moneyminder.domain.user.application.dto.request.UserSignupReq;
import com.moneyminder.domain.user.domain.User;
import com.moneyminder.domain.user.domain.repository.UserRepository;
import com.moneyminder.domain.user.domain.type.SocialType;
import com.moneyminder.domain.user.domain.type.UserRole;
import com.moneyminder.dto.JwtClaims;
import com.moneyminder.exception.BaseException;
import com.moneyminder.exception.ResultCode;
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

    public User getUserInfo(String email) {
        return User.builder()
                .email(email)
                .name("이강은")
                .userRole(UserRole.USER)
                .socialType(SocialType.NORMAL)
                .build();
//        return userRepository.findByEmail(email)
//                .orElseThrow(() -> new BaseException(ResultCode.USER_NOT_FOUND));
    }
}
