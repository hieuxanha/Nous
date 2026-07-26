package com.example.be.service;

import com.example.be.dto.RegisterRequest;
import com.example.be.entity.User;

public interface UserService {
    User register(RegisterRequest request);
    User findByEmail(String email);
}