package com.example.be.controller;

// DTO trả về danh sách wishlist
import com.example.be.dto.WishlistResponse;

// Service xử lý nghiệp vụ wishlist
import com.example.be.service.WishlistService;

// Spring
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

////////////////////////////////////////////////////////////////////

// Đánh dấu đây là REST Controller (trả JSON)
@RestController

// URL gốc cho wishlist
// => /api/wishlist/...
@RequestMapping("/api/wishlist")

// Cho phép FE (Angular/React) gọi API từ domain khác
@CrossOrigin("*")
public class WishlistController {

    // ==================================================
    // Inject WishlistService (KHÔNG làm việc trực tiếp với Repository)
    // ==================================================
    @Autowired
    private WishlistService wishlistService;

    // ==================================================
    // 1️⃣ API: LẤY DANH SÁCH WISHLIST CỦA USER
    // ==================================================

    // GET /api/wishlist/{userId}
    @GetMapping("/{userId}")
    public ResponseEntity<List<WishlistResponse>> getUserWishlist(
            @PathVariable Long userId // Lấy userId từ URL
    ) {
        // Gọi service lấy wishlist
        return ResponseEntity.ok(
                wishlistService.getWishlistByUserId(userId)
        );
    }

    // ==================================================
    // 2️⃣ API: KIỂM TRA SẢN PHẨM CÓ TRONG WISHLIST KHÔNG
    // ==================================================

    // GET /api/wishlist/check?userId=1&productId=10
    @GetMapping("/check")
    public ResponseEntity<?> checkFavorite(
            @RequestParam Long userId,     // Lấy userId từ query param
            @RequestParam Long productId   // Lấy productId từ query param
    ) {
        // Kiểm tra trạng thái yêu thích
        boolean isFavorite =
                wishlistService.isFavorite(userId, productId);

        // Trả về JSON cho FE
        // { "isFavorite": true/false }
        return ResponseEntity.ok(
                Map.of("isFavorite", isFavorite)
        );
    }

    // ==================================================
    // 3️⃣ API: TOGGLE WISHLIST (THÊM / XÓA)
    // ==================================================

    // POST /api/wishlist/toggle?userId=1&productId=10
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleWishlist(
            @RequestParam Long userId,
            @RequestParam Long productId
    ) {
        // Gọi service xử lý toggle
        // Trả về message + status
        return ResponseEntity.ok(
                wishlistService.toggleWishlist(userId, productId)
        );
    }
}
