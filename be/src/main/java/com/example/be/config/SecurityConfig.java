package com.example.be.config;

import com.example.be.utils.JwtAuthenticationFilter;
import com.example.be.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil);
    }

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
                .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // --- 1. NHÓM PUBLIC (Ai cũng vào được) ---ntroller lo liệu.
                        // Ở đây chỉ cần check "đã đăng nhập chưa" là đủ.
                        .requestMatchers("/auth/**").permitAll()      // Login, Register
                        .requestMatchers("/files/**").permitAll()     // Xem ảnh
                        .requestMatchers("/h2-console/**").permitAll() // DB Console

                        // Xem danh sách/chi tiết (GET) -> Public
                        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reviews/product/**").permitAll()
                        .requestMatchers("/api/chat/**").permitAll() // Cho phép chat không cần login
//                        .requestMatchers("/api/cart/**").authenticated()



                        // --- 2. NHÓM AUTHENTICATED (Phải đăng nhập) ---
                        // Bao gồm: User thường, Admin...
                        // Việc Admin mới được xóa/sửa sẽ do @PreAuthorize ở Co


//                         "Tất cả những API nào chưa được nhắc tên ở trên,
//                        thì MẶC ĐỊNH cho phép truy cập, MIỄN LÀ ĐÃ ĐĂNG NHẬP (có Token hợp lệ)."
                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

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