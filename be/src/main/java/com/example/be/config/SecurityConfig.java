package com.example.be.config;

import com.example.be.utils.JwtAuthenticationFilter;
import com.example.be.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; // Kích hoạt @PreAuthorize
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // <--- QUAN TRỌNG: Kích hoạt @PreAuthorize("hasAuthority('ROLE_ADMIN')")
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults()) // Kích hoạt CORS
                .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF (đúng chuẩn cho API dùng JWT)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // -----------------------------------------------------------------
                // [QUAN TRỌNG] Quy định mã lỗi trả về cho Angular.
                // Nếu KHÔNG khai báo đoạn này, Spring dùng Http403ForbiddenEntryPoint
                // mặc định -> request thiếu token / token hết hạn đều trả về 403.
                // Interceptor bên Angular thường chỉ bắt 401 để đá về trang login,
                // nên thiếu đoạn này thì token hết hạn sẽ không tự logout được.
                // -----------------------------------------------------------------
                .exceptionHandling(ex -> ex
                        // Chưa đăng nhập / token sai / token hết hạn -> 401 Unauthorized
                        .authenticationEntryPoint((req, res, authEx) -> {
                            res.setStatus(401);
                            res.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            res.setCharacterEncoding("UTF-8");
                            res.getWriter().write("{\"error\":\"Unauthorized - vui lòng đăng nhập lại\"}");
                        })
                        // Đã đăng nhập nhưng không đủ quyền (VD: user thường gọi API admin) -> 403
                        .accessDeniedHandler((req, res, deniedEx) -> {
                            res.setStatus(403);
                            res.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            res.setCharacterEncoding("UTF-8");
                            res.getWriter().write("{\"error\":\"Forbidden - bạn không có quyền thực hiện thao tác này\"}");
                        })
                )

                .authorizeHttpRequests(auth -> auth
                        // --- 1. NHÓM PUBLIC (Ai cũng vào được) ---
                        .requestMatchers("/auth/**").permitAll()      // Login, Register

                        // CHỈ cho phép GET (xem ảnh). Nếu để "/files/**" trống method thì
                        // POST /files/upload cũng thành public -> ai cũng upload file lên server được.
                        .requestMatchers(HttpMethod.GET, "/files/**").permitAll()

                        // Xem danh sách/chi tiết (GET) -> Public
                        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reviews/product/**").permitAll()
                        .requestMatchers("/api/chat/**").permitAll() // Cho phép chat không cần login

                        // --- 2. NHÓM AUTHENTICATED (Phải đăng nhập) ---
                        // "Tất cả những API nào chưa được nhắc tên ở trên thì MẶC ĐỊNH
                        //  phải ĐÃ ĐĂNG NHẬP (có Token hợp lệ) mới gọi được."
                        // Riêng việc Admin mới được xóa/sửa do @PreAuthorize ở Controller lo.
                        .anyRequest().authenticated()
                )

                // Không khai báo filter này là @Bean, vì Spring Boot sẽ tự động đăng ký
                // Filter bean vào servlet chain chung, chạy cho cả request ngoài security chain.
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Cho phép Angular (localhost:4200) gọi API
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));

        // Cho phép đủ các method: GET, POST, PUT, DELETE...
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));

        // Cho phép mọi header (Authorization...)
        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
