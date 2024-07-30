package com.moneyminder.global.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import com.moneyminder.global.response.ErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
public class GlobalExceptionFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (BaseException e) {
            handleException(response, e.getResultCode(), e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
            handleException(response, ResultCode.INTERNAL_ERROR, "Unexpected error occurred");
        }
    }

    private void handleException(HttpServletResponse response, ResultCode resultCode, String message)
            throws IOException {
        response.setStatus(resultCode.getHttpStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ErrorResponse errorResponse = ErrorResponse.of(resultCode, message);
        response.getWriter().write(toJson(errorResponse));
    }

    private String toJson(ErrorResponse errorResponse) {
        try {
            return objectMapper.writeValueAsString(errorResponse);
        } catch (Exception e) {
            return "{}";
        }
    }
}
