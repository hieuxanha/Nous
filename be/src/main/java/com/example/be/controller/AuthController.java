package com.example.be.controller;

import com.example.be.dto.*;
import com.example.be.entity.User;
import com.example.be.service.UserService;
import com.example.be.utils.JwtUtil;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController

@RequestMapping("/auth")

@RequiredArgsConstructor

// -------------------------------------------------------------------------
// [QUAN TRỌNG 1]: Cấu hình CORS
// Dòng này mở "cửa khẩu" cho phép website Angular (chạy ở port 4200)
// được phép gửi dữ liệu vào đây. Nếu thiếu sẽ bị lỗi "CORS Policy".
// -------------------------------------------------------------------------
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserService userService;

    private final com.example.be.repository.UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // Constructor Injection (Nạp các công cụ cần thiết vào Controller)


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
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        // B1: Tìm user trong DB theo email
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));


        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Invalid credentials"));
        }

        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        // B4: Tạo Token (Vé thông hành)
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), roles);

        // B5: Trả về cục dữ liệu đầy đủ cho Angular
        return ResponseEntity.ok(new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getGender(),
                roles
        ));
    }


    // Trong AuthController.java
//
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
//        try {
//            // Gọi qua Service, code controller giờ chỉ còn 1 dòng logic chính
//            LoginResponse response = userService.login(req);
//            return ResponseEntity.ok(response);
//        } catch (RuntimeException e) {
//            // Bắt lỗi từ Service ném ra
//            return ResponseEntity.status(401).body(Collections.singletonMap("error", e.getMessage()));
//        }
//    }
}