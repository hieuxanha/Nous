package com.example.be.service.impl;

import com.example.be.dto.LoginRequest;
import com.example.be.dto.LoginResponse;
import com.example.be.dto.RegisterRequest;
import com.example.be.entity.Role;
import com.example.be.entity.User;
import com.example.be.constant.RoleName;
import com.example.be.repository.RoleRepository;
import com.example.be.repository.UserRepository;
import com.example.be.service.UserService;
import com.example.be.exception.ResourceAlreadyExistsException;
import com.example.be.utils.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional // Đảm bảo nếu có lỗi trong quá trình lưu, mọi thay đổi sẽ được hoàn tác (Rollback)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
//    private final JwtUtil jwtUtil;


    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(RegisterRequest request) {

        // 1. Kiểm tra Email trùng
        // Nếu email đã tồn tại, ném ra lỗi để dừng chương trình ngay lập tức.
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already in use");
        }

        // 2. Logic Phân Quyền (Role)
        // Kiểm tra xem request gửi lên có yêu cầu role "admin" không?
        // - Nếu có: Gán quyền ROLE_ADMIN
        // - Nếu không (hoặc null): Mặc định gán ROLE_USER
        RoleName requested = "admin".equalsIgnoreCase(request.getRole()) ? RoleName.ROLE_ADMIN : RoleName.ROLE_USER;

        // Tìm quyền trong DB, nếu chưa có thì tạo mới (tránh lỗi NullPointerException)
        Role role = roleRepository.findByName(requested).orElseGet(() -> {
            Role r = new Role();
            r.setName(requested);
            return roleRepository.save(r);
        });

        // 3. Tạo User mới (Builder Pattern)
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .gender(request.getGender())
                // ---------------------------------------------------------
                // [QUAN TRỌNG 3]: Mã hóa mật khẩu
                // KHÔNG BAO GIỜ lưu mật khẩu thô. Phải dùng passwordEncoder.encode()
                // để biến đổi nó thành chuỗi ký tự bảo mật.
                // ---------------------------------------------------------
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singleton(role)) // Gán quyền vừa tìm được cho user
                .build();

        // 4. Lưu xuống Database
        return userRepository.save(user);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }


//    @Override
//    public LoginResponse login(LoginRequest req) {
//        // 1. Tìm user
//        User user = userRepository.findByEmail(req.getEmail())
//                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
//
//        // 2. Check pass
//        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
//            throw new RuntimeException("Invalid credentials"); // Hoặc ném Exception tùy chỉnh
//        }
//
//        // 3. Lấy roles
//        List<String> roles = user.getRoles().stream()
//                .map(r -> r.getName().name())
//                .collect(Collectors.toList());
//
//        // 4. Tạo token
//        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), roles);
//
//        // 5. Trả về DTO
//        return new LoginResponse(token, "Bearer", user.getId(), user.getEmail(), user.getFullName(), user.getGender(), roles);
//    }
}