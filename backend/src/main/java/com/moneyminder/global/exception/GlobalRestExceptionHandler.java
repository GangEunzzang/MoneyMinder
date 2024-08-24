package com.moneyminder.global.exception;

import com.moneyminder.global.response.ErrorResponse;
import io.micrometer.core.instrument.config.validate.ValidationException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalRestExceptionHandler {

    @ExceptionHandler(BaseException.class)
    protected ResponseEntity<ErrorResponse> handleBaseException(BaseException e) {
        return ResponseEntity
                .status(e.getResultCode().getHttpStatus())
                .body(ErrorResponse.of(e.getResultCode(), e.getMessage()));
    }

    @ExceptionHandler(ValidationException.class)
    protected ResponseEntity<ErrorResponse> handleValidationException(ValidationException e) {
        return ResponseEntity
                .badRequest()
                .body(ErrorResponse.of(ResultCode.INVALID_INPUT_VALUE, e.getMessage()));
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ErrorResponse> bindException(BindException e) {
        List<ObjectError> allErrors = e.getAllErrors();
        String sb = allErrors.stream()
                .map(error -> error.getDefaultMessage() + "\n")
                .collect(Collectors.joining());

        return ResponseEntity
                .badRequest()
                .body(ErrorResponse.of(ResultCode.INVALID_INPUT_VALUE, sb));
    }



    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponse> handleException(Exception e) {
        return ResponseEntity
                .internalServerError()
                .body(ErrorResponse.of(ResultCode.INTERNAL_ERROR, e.getMessage()));
    }

}
