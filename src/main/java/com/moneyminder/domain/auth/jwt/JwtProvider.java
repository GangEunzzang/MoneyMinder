package com.moneyminder.domain.auth.jwt;

import com.moneyminder.domain.auth.jwt.dto.TokenDto;
import com.moneyminder.domain.auth.properties.TokenProperties;
import com.moneyminder.domain.user.entity.RefreshToken;
import com.moneyminder.domain.user.entity.User;
import com.moneyminder.domain.user.repository.RefreshTokenRepository;
import com.moneyminder.domain.user.repository.UserRepository;
import com.moneyminder.domain.user.type.UserRole;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.security.Key;
import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtProvider {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenProperties tokenProperties;

    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String AUTHORITIES_KEY = "authority";

    private Key key;

    @PostConstruct
    protected void init() {
        byte[] keyBytes = Decoders.BASE64.decode(tokenProperties.getSecretKey());
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public TokenDto generateToken(String email, UserRole userRole) {
        String newAccessToken = generateAccessToken(email, userRole);
        String newRefreshToken = generateRefreshToken();

        RefreshToken preRefreshToken = refreshTokenRepository.findByEmail(email)
                .orElseGet(() -> RefreshToken.of(email, newRefreshToken));

        preRefreshToken.changeTokenValue(newRefreshToken);
        refreshTokenRepository.save(preRefreshToken);

        return TokenDto.of(newAccessToken, newRefreshToken);
    }


    public TokenDto reissueToken(TokenDto tokenDto) {
        validateToken(tokenDto.refreshToken());

        RefreshToken refreshToken = refreshTokenRepository.findByTokenValue(tokenDto.refreshToken())
                .orElseThrow(() -> new BaseException(ResultCode.JWT_INVALID));

        User user = userRepository.findByEmail(refreshToken.getEmail())
                .orElseThrow(() -> new BaseException(ResultCode.USER_NOT_FOUND));

        String newAccessToken = generateAccessToken(user.getEmail(), user.getUserRole());
        String newRefreshToken = generateRefreshToken();

        refreshToken.changeTokenValue(newRefreshToken);
        refreshTokenRepository.save(refreshToken);

        return TokenDto.of(newAccessToken, newRefreshToken);
    }

    public Authentication getAuthentication(String accessToken) {
        validateToken(accessToken);
        Claims claims = parseClaims(accessToken);

        if (claims.get(AUTHORITIES_KEY) == null) {
            throw new BaseException(ResultCode.JWT_INVALID);
        }

        UserRole userRole = UserRole.fromKey(claims.get(AUTHORITIES_KEY));

        return new UsernamePasswordAuthenticationToken(
                claims.getSubject(),
                null,
                Collections.singletonList(new SimpleGrantedAuthority(userRole.getKey()))
        );
    }

    public void validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            throw new BaseException(ResultCode.JWT_INVALID_SIGN);
        } catch (ExpiredJwtException e) {
            throw new BaseException(ResultCode.JWT_EXPIRED);
        } catch (UnsupportedJwtException e) {
            throw new BaseException(ResultCode.JWT_UNSUPPORTED);
        } catch (IllegalArgumentException e) {
            throw new BaseException(ResultCode.JWT_INVALID);
        } catch (Exception e) {
            throw new BaseException(ResultCode.JWT_PROCESS_ERROR);
        }
    }

    public Optional<String> extractBearerToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);

        return StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX) ?
                Optional.of(bearerToken.substring(BEARER_PREFIX.length())) :
                Optional.empty();
    }

    public User getUserByRequest(HttpServletRequest request) {
        String bearerToken = extractBearerToken(request)
                .orElseThrow(() -> new BaseException(ResultCode.JWT_NOT_FOUND));

        validateToken(bearerToken);

        String userId = parseClaims(bearerToken).getSubject();

        return userRepository.findByEmail(userId)
                .orElseThrow(() -> new BaseException(ResultCode.USER_NOT_FOUND));
    }

    public String getEmailByRequest(HttpServletRequest request) {
        String bearerToken = extractBearerToken(request)
                .orElseThrow(() -> new BaseException(ResultCode.JWT_NOT_FOUND));

        validateToken(bearerToken);

        return parseClaims(bearerToken).getSubject();
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            throw new BaseException(ResultCode.JWT_INVALID);
        }
    }

    private String generateAccessToken(String userId, UserRole userRole) {
        return Jwts.builder()
                .setSubject(userId)
                .claim(AUTHORITIES_KEY, userRole.getKey())
                .setExpiration(Date.from(Instant.now().plusMillis(tokenProperties.getAccessTokenExpiry())))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private String generateRefreshToken() {
        return Jwts.builder()
                .setExpiration(Date.from(Instant.now().plusMillis(tokenProperties.getRefreshTokenExpiry())))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }


}