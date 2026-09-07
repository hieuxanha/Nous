package com.example.be.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Bắt lỗi trùng tên (Unique Constraint) -> Trả về 409 Conflict
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDuplicateEntry(DataIntegrityViolationException e) {
        // Đây chính là chỗ giúp bạn hết bị lỗi 500 khi trùng tên
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Collections.singletonMap("message", "Tên danh mục này đã tồn tại, vui lòng chọn tên khác!"));
    }

    // 2. Bắt lỗi Validation (Dữ liệu rỗng) -> Trả về 400 Bad Request
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }

    // 3. Bắt lỗi sai email / sai mật khẩu (do UserServiceImpl.login ném ra) -> 401 Unauthorized
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("error", e.getMessage()));
    }

    // 4. Bắt các lỗi còn lại (để in ra màn hình console xem cho dễ)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception e) {
        e.printStackTrace(); // In lỗi đỏ lòm ra console server để debug
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Lỗi hệ thống: " + e.getMessage()));
    }
}