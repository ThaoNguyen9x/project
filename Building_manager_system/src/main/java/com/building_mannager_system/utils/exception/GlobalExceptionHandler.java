package com.building_mannager_system.utils.exception;

import com.building_mannager_system.dto.RestResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private ResponseEntity<RestResponse<Object>> buildErrorResponse(Exception ex, HttpStatus status, String error) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(status.value());
        res.setError(ex.getMessage());
        res.setMessage(error);
        return new ResponseEntity<>(res, status);
    }

    @ExceptionHandler(value = {
            BadCredentialsException.class,
            UsernameNotFoundException.class,
    })
    public ResponseEntity<RestResponse<Object>> handleGlobalException(Exception ex,
                                                                      WebRequest request) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST, "Exception occurs...");
    }

    @ExceptionHandler(value = {
            APIException.class,
    })
    public ResponseEntity<RestResponse<Object>> handleAPIException(APIException ex,
                                                                   WebRequest request) {
        return buildErrorResponse(ex, ex.getStatus(), "Exception occurs...");
    }
}
