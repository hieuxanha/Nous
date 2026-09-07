package com.example.be.controller;

import com.example.be.dto.*;
import com.example.be.entity.User;
import com.example.be.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

// -------------------------------------------------------------------------
// [QUAN TRỌNG 1]: Cấu hình CORS
// Dòng này mở "cửa khẩu" cho phép website Angular
// (chạy ở port 4200)
// được phép gửi dữ liệu vào đây. Nếu thiếu sẽ bị lỗi "CORS Policy".jhjhjj
// -------------------------------------------------------------------------
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    // Controller giờ chỉ cần đúng 1 dependency: Service
    private final UserService userService;

    // --- API ĐĂNG KÝ ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        // Gọi Service để xử lý logic lưu vào database
        User u = userService.register(req);

        // -------------------------------------------------------------------------
        // [QUAN TRỌNG 2]: Trả về JSON chuẩn
        // Angular mặc định mong đợi phản hồi là JSON. Nếu trả về String trơ trọi
        // (VD: return "Success"), Angular sẽ báo lỗi "HttpErrorResponse syntax error".
        // Dùng Collections.singletonMap để tạo nhanh JSON: { "message": "Registered successfully" }
        // -------------------------------------------------------------------------
        return ResponseEntity.ok(Collections.singletonMap("message", "Registered successfully"));
    }

    // --- API ĐĂNG NHẬP ---
    // Logic (tìm user, so mật khẩu, sinh JWT) nằm trong UserServiceImpl.login().
    // Lỗi sai tài khoản/mật khẩu do GlobalExceptionHandler bắt và trả về 401.
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(userService.login(req));
    }
}

