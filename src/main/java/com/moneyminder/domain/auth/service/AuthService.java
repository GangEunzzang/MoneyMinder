package com.moneyminder.domain.auth.service;

import com.moneyminder.domain.auth.jwt.JwtProvider;
import com.moneyminder.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
}
