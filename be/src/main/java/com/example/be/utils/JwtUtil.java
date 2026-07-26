package com.example.be.utils;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.*;
import java.security.Key;
import java.util.Date;

// jwt chúng đóng vai trò như bộ phận
// cấp giấy  thônghnanhf và kiểm soát an linh

@Component // Đánh dấu để Spring quản lý (Bean)
public class JwtUtil {
    private final Key key; // Chìa khóa bí mật để ký tên vào token
    private final long expirationMs; // Thời gian hết hạn (VD: 86400000ms = 1 ngày)

    // Lấy cấu hình từ file application.properties
    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expiration-ms}") long expirationMs) {
        // Mã hóa chuỗi bí mật thành đối tượng Key chuẩn HMAC
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationMs;
    }

    // --- HÀM TẠO TOKEN (Dùng lúc Đăng nhập) ---
    public String generateToken(String username, Long userId, Collection<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles); // Nhét danh sách quyền vào token
        claims.put("userId", userId); // Nhét userId vào token (tiện để lấy sau này)

        return Jwts.builder()
                .setSubject(username) // Chủ sở hữu token (thường là email/username)
                .addClaims(claims) // Thêm các thông tin phụ (roles, userId)
                .setIssuedAt(new Date()) // Thời điểm tạo
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs)) // Thời điểm hết hạn
                .signWith(key, SignatureAlgorithm.HS256) // Ký tên bằng thuật toán HS256 và chìa khóa bí mật
                .compact(); // Nén thành chuỗi String
    }

    // --- HÀM KIỂM TRA TOKEN (Dùng cho mỗi Request) ---
    public boolean validateToken(String token) {
        try {
            // Thử giải mã token bằng chìa khóa bí mật
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true; // Nếu giải mã thành công -> Token hợp lệ
        } catch (JwtException ex) {
            // Nếu lỗi (Hết hạn, sai chữ ký, token rác...) -> Trả về false
            return false;
        }
    }

    // Hàm phụ để lấy dữ liệu bên trong token ra
    public Claims getClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
}
