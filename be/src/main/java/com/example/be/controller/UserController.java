// Khai báo package (vị trí file trong project)
package com.example.be.controller;

// Import enum tên role (ROLE_ADMIN, ROLE_USER...)
import com.example.be.constant.RoleName;

// Import entity Role
import com.example.be.entity.Role;

// Import entity User
import com.example.be.entity.User;

// Import repository thao tác DB với User
import com.example.be.repository.UserRepository;

// Import repository thao tác DB với Role
import com.example.be.repository.RoleRepository;

// Lombok: tự tạo constructor cho các field final
import lombok.RequiredArgsConstructor;

// Trả về HTTP response (status + body)
import org.springframework.http.ResponseEntity;

// Phân quyền truy cập API
import org.springframework.security.access.prepost.PreAuthorize;

// Các annotation REST
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

//////////////////////////////////////////////////////////////////////////

// Đánh dấu đây là REST Controller (trả JSON)
@RestController

// URL gốc cho controller này
// => /api/users/...
@RequestMapping("/api/users")

// Lombok tự sinh constructor
@RequiredArgsConstructor

// Cho phép gọi API từ domain khác (Angular, React...)
@CrossOrigin("*")
public class UserController {

    // Repository User (inject tự động)
    private final UserRepository userRepository;

    // Repository Role (inject tự động)
    private final RoleRepository roleRepository;

    // ======================================================
    // 1️⃣ API: LẤY TẤT CẢ USER (CHỈ ADMIN)
    // ======================================================

    // GET /api/users
    @GetMapping

    // Chỉ cho phép user có quyền ROLE_ADMIN
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {

        // Lấy toàn bộ user trong DB
        List<User> users = userRepository.findAll();

        // Trả về HTTP 200 + danh sách user
        return ResponseEntity.ok(users);
    }

    // ======================================================
    // 2️⃣ API: LẤY USER THEO ID
    // ======================================================

    // GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            // Tìm user theo id
            User user = userRepository.findById(id)
                    // Nếu không tìm thấy thì ném lỗi
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Trả về user
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            // Nếu lỗi → trả về 400 + message
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    // ======================================================
    // 3️⃣ API: CẬP NHẬT PROFILE USER
    // ======================================================

    // PUT /api/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(
            // Lấy id từ URL
            @PathVariable Long id,

            // Body JSON gửi lên
            @RequestBody Map<String, Object> body
    ) {
        try {
            // Tìm user theo id
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // Cập nhật họ tên (hỗ trợ nhiều key khác nhau)
            if (body.containsKey("fullName"))
                user.setFullName((String) body.get("fullName"));
            else if (body.containsKey("full_name"))
                user.setFullName((String) body.get("full_name"));

            // Cập nhật số điện thoại
            if (body.containsKey("phone"))
                user.setPhone((String) body.get("phone"));
            else if (body.containsKey("phone_number"))
                user.setPhone((String) body.get("phone_number"));
            else if (body.containsKey("phoneNumber"))
                user.setPhone((String) body.get("phoneNumber"));

            // Cập nhật giới tính
            if (body.containsKey("gender"))
                user.setGender((String) body.get("gender"));

            // Lưu lại DB
            userRepository.save(user);

            // Trả về thông báo thành công
            return ResponseEntity.ok(
                    Collections.singletonMap("message", "Cập nhật thành công!")
            );

        } catch (Exception e) {
            // Trả lỗi nếu có exception
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "Lỗi: " + e.getMessage()));
        }
    }

    // ======================================================
    // 4️⃣ API: CẬP NHẬT ROLE USER (ADMIN)
    // ======================================================

    // PUT /api/users/{id}/role?roleName=ROLE_ADMIN
    @PutMapping("/{id}/role")

    // Chỉ ADMIN mới được đổi quyền
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @RequestParam String roleName
    ) {
        try {
            // Tìm user
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Convert String -> enum RoleName
            RoleName rName = RoleName.valueOf(roleName);

            // Tìm role trong DB
            Role role = roleRepository.findByName(rName)
                    .orElseThrow(() -> new RuntimeException("Role not found"));

            // Set lại role cho user
            user.setRoles(new java.util.HashSet<>(Collections.singletonList(role)));

            // Lưu DB
            userRepository.save(user);

            return ResponseEntity.ok(
                    Collections.singletonMap("message", "Cập nhật quyền thành công!")
            );

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    // ======================================================
    // 5️⃣ API: XÓA USER (ADMIN)
    // ======================================================

    // DELETE /api/users/{id}
    @DeleteMapping("/{id}")

    // Chỉ ADMIN được xóa
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deteleUser(@PathVariable Long id) {

        // Xóa user theo id
        userRepository.deleteById(id);

        // Trả thông báo
        return ResponseEntity.ok(
                Collections.singletonMap("message", "Đã xóa thành công")
        );
    }
}
