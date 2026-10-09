package com.group04.utils;

import java.time.Instant;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestControllerAdvice
public class ApiExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);
    @ExceptionHandler(ApiException.class)
    ResponseEntity<?> api(ApiException e) {
        return body(e.status(), e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<?> validation(MethodArgumentNotValidException e) {
        var fields = new LinkedHashMap<String, String>();
        e.getBindingResult().getFieldErrors().forEach(x -> fields.putIfAbsent(x.getField(), x.getDefaultMessage()));
        return ResponseEntity.badRequest().body(
                Map.of("timestamp", Instant.now(), "status", 400, "message", "Dữ liệu không hợp lệ", "errors", fields));
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<?> unknown(Exception e) {
        log.error("Unhandled API error", e);
        return body(HttpStatus.INTERNAL_SERVER_ERROR, "Đã xảy ra lỗi hệ thống. Vui lòng thử lại.");
    }

    private ResponseEntity<?> body(HttpStatus s, String m) {
        return ResponseEntity.status(s).body(Map.of("timestamp", Instant.now(), "status", s.value(), "message", m));
    }
}

