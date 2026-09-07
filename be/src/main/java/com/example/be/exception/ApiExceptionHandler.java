package com.example.be.exception;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<String> handleExists(ResourceAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    // LƯU Ý: KHÔNG đặt @ExceptionHandler(Exception.class) ở đây nữa.
    // Spring duyệt các @ControllerAdvice theo thứ tự, gặp advice nào có method khớp
    // là dùng luôn advice đó. Một catch-all Exception ở đây sẽ "nuốt" hết mọi lỗi
    // (kể cả BadCredentialsException) và trả 500, khiến các handler cụ thể
    // trong GlobalExceptionHandler không bao giờ được gọi.
    // Việc bắt lỗi chung đã có GlobalExceptionHandler lo.
}
