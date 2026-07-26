package com.example.be.controller;

import com.example.be.dto.AddToCartRequest;
import com.example.be.dto.CartDTO;
import com.example.be.entity.User;
import com.example.be.repository.UserRepository;
import com.example.be.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder; // 3. Import Security
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin("*") // Cho phép Angular gọi API
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    // Giả lập lấy ID user từ token. Trong thực tế bạn sẽ lấy từ Principal/Authentication
    // Ví dụ tạm thời truyền userId qua param hoặc fix cứng để test
// --- HÀM NÀY ĐÃ ĐƯỢC SỬA ---
    private Long getCurrentUserId() {
        // Lấy email từ Token đã được Security Filter xác thực
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Tìm user trong DB dựa theo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng đăng nhập"));

        return user.getId(); // Trả về ID thật của người đang đăng nhập
    }
    @GetMapping
    public ResponseEntity<CartDTO> getCart() {        return ResponseEntity.ok(cartService.getCartByUser(getCurrentUserId()));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(@RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(getCurrentUserId(), request));
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartDTO> updateQuantity(@PathVariable Long itemId, @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(getCurrentUserId(), itemId, quantity));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<CartDTO> removeItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(getCurrentUserId(), itemId));
    }
}