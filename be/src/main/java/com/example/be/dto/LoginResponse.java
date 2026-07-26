package com.example.be.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
@Data
@AllArgsConstructor
public class LoginResponse {
    // Chuỗi JWT để xác thực sau này
    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String email;
    private String fullName;
    private String gender;
    private List<String> roles;
}
