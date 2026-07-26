package com.example.be.utils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

// OncePerRequestFilter: Đảm bảo bộ lọc này chỉ chạy đúng 1 lần cho mỗi request
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        // 1. Lấy header Authorization từ request gửi lên
        String header = req.getHeader("Authorization");

        // 2. Kiểm tra xem header có chứa Token chuẩn (bắt đầu bằng "Bearer ") không?
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7); // Cắt bỏ chữ "Bearer " để lấy mã token thuần

            // 3. Dùng JwtUtil để kiểm tra Token có xịn không
            if (jwtUtil.validateToken(token)) {

                // 4. Nếu Token xịn, trích xuất thông tin bên trong
                Claims claims = jwtUtil.getClaims(token);
                String username = claims.getSubject();
                List<String> roles = claims.get("roles", List.class); // Lấy list quyền

                // 5. Chuyển đổi quyền từ String sang chuẩn của Spring Security (SimpleGrantedAuthority)
                // Spring Security cần cái này để check @PreAuthorize("hasRole('ADMIN')")
                List<SimpleGrantedAuthority> authorities = Optional.ofNullable(roles)
                        .orElse(Collections.emptyList())
                        .stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());

                // 6. Tạo đối tượng Authentication (Chứng minh thư trong hệ thống)
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);

                // 7. [QUAN TRỌNG NHẤT] Lưu thông tin vào SecurityContext
                // Dòng này nói với Spring Boot: "Người này đã đăng nhập thành công, hãy cho phép truy cập!"
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        // 8. Cho phép request đi tiếp (tới Filter tiếp theo hoặc tới Controller)
        chain.doFilter(req, res);
    }
}