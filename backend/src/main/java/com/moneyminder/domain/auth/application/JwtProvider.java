package com.moneyminder.domain.auth.application;

import com.moneyminder.domain.auth.domain.RefreshToken;
import com.moneyminder.domain.auth.domain.TokenInfo;
import com.moneyminder.domain.auth.domain.repository.RefreshTokenRepository;
import com.moneyminder.domain.auth.properties.TokenProperties;
import com.moneyminder.domain.user.domain.User;
import com.moneyminder.domain.user.domain.repository.UserRepository;
import com.moneyminder.domain.user.domain.type.UserRole;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import java.security.Key;
import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtProvider {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenProperties tokenProperties;

    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String REFRESH_TOKEN_HEADER = "RefreshToken";
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String AUTHORITIES_KEY = "authority";
    public static final String REFRESH_TOKEN_SUBJECT = "RefreshToken";

    private Key key;

    @PostConstruct
    protected void init() {
        byte[] keyBytes = Decoders.BASE64.decode(tokenProperties.getSecretKey());
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public TokenInfo generateToken(User user) {
        String newAccessToken = generateAccessToken(user);
        String newRefreshToken = generateRefreshToken();

        RefreshToken refreshToken = RefreshToken.create(user.email(), newRefreshToken);

        refreshTokenRepository.save(refreshToken);

        return TokenInfo.create(newAccessToken, newRefreshToken);
    }


    public TokenInfo reissueToken(String refreshToken) {
        validateToken(refreshToken);

        RefreshToken currentRefreshToken = refreshTokenRepository.findByTokenValue(refreshToken)
                .orElseThrow(() -> new BaseException(ResultCode.JWT_INVALID));

        User user = userRepository.findByEmail(currentRefreshToken.email())
                .orElseThrow(() -> new BaseException(ResultCode.USER_NOT_FOUND));

        String newAccessToken = generateAccessToken(user);
        String newRefreshToken = generateRefreshToken();

        refreshTokenRepository.delete(currentRefreshToken);
        refreshTokenRepository.save(RefreshToken.create(user.email(), newRefreshToken));

        return TokenInfo.create(newAccessToken, newRefreshToken);
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

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new BaseException(ResultCode.JWT_EXPIRED);
        } catch (UnsupportedJwtException e) {
            throw new BaseException(ResultCode.JWT_UNSUPPORTED);
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            throw new BaseException(ResultCode.JWT_INVALID_SIGN);
        } catch (IllegalArgumentException e) {
            throw new BaseException(ResultCode.JWT_INVALID);
        } catch (Exception e) {
            throw new BaseException(ResultCode.JWT_PROCESS_ERROR);
        }
    }

    public Optional<String> extractAccessToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        return StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX) ?
                Optional.of(bearerToken.substring(BEARER_PREFIX.length())) :
                Optional.empty();
    }

    public Optional<String> extractRefreshToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(REFRESH_TOKEN_HEADER);
        return StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX) ?
                Optional.of(bearerToken.substring(BEARER_PREFIX.length())) :
                Optional.empty();
    }

    public User getUserByRequest(HttpServletRequest request) {
        String bearerToken = extractAccessToken(request)
                .orElseThrow(() -> new BaseException(ResultCode.JWT_NOT_FOUND));

        validateToken(bearerToken);

        String userId = parseClaims(bearerToken).getSubject();

        return userRepository.findByEmail(userId)
                .orElseThrow(() -> new BaseException(ResultCode.USER_NOT_FOUND));
    }

    public String getEmailByRequest(HttpServletRequest request) {
        String bearerToken = extractAccessToken(request)
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

    private String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(user.email())
                .claim(AUTHORITIES_KEY, user.userRole().getKey())
                .claim("name", user.name())
                .setExpiration(Date.from(Instant.now().plusMillis(tokenProperties.getAccessTokenExpiry())))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private String generateRefreshToken() {
        return Jwts.builder()
                .setSubject(REFRESH_TOKEN_SUBJECT)
                .setExpiration(Date.from(Instant.now().plusMillis(tokenProperties.getRefreshTokenExpiry())))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }


}
