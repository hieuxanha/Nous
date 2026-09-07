package com.example.be.service;

import com.example.be.dto.LoginRequest;
import com.example.be.dto.LoginResponse;
import com.example.be.dto.RegisterRequest;
import com.example.be.entity.User;

public interface UserService {
    User register(RegisterRequest request);
    User findByEmail(String email);

    // Xử lý đăng nhập: check email + password, sinh JWT và trả về dữ liệu cho FE
    LoginResponse login(LoginRequest request);
}
