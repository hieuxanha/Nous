package com.example.be.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank private String fullName;
    @NotBlank @Email private String email;
    private String phone;
    private String gender;
    @NotBlank @Size(min=8)
    private String password;
    private String role; // "admin" or "user" - optional, default user
}