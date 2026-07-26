package com.example.be.config;

import com.example.be.constant.RoleName;
import com.example.be.entity.Role;
import com.example.be.entity.User;
import com.example.be.repository.RoleRepository;
import com.example.be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor

public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner init(RoleRepository roleRepository, UserRepository userRepository) {
        return args -> {


            // 1. Tạo ROLE_ADMIN nếu chưa có
            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .name(RoleName.ROLE_ADMIN)
                            .build()));

            // 2. Tạo ROLE_USER nếu chưa có
            roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .name(RoleName.ROLE_USER)
                            .build()));

            // 3. Tạo tài khoản Admin mặc định
            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                User admin = User.builder()
                        .fullName("Administrator")
                        .email("admin@gmail.com")
                        .gender("nam")
                        .phone("0000000000")
                        .password(passwordEncoder.encode("123123")) // mật khẩu
                        .roles(Set.of(adminRole))
                        .build();

                userRepository.save(admin);
                userRepository.save(admin);
                System.out.println(">>> Admin user created: admin@gmail.com / admin123");
            }
        };
    }
}
