package com.example.be.service.impl;

// DTO trả về cho Frontend
import com.example.be.dto.WishlistResponse;

// Entity
import com.example.be.entity.Product;
import com.example.be.entity.User;
import com.example.be.entity.Wishlist;

// Repository thao tác DB
import com.example.be.repository.ProductRepository;
import com.example.be.repository.UserRepository;
import com.example.be.repository.WishlistRepository;

// Interface Service
import com.example.be.service.WishlistService;

// Lombok
import lombok.RequiredArgsConstructor;

// Spring
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

////////////////////////////////////////////////////////////////////

// Đánh dấu đây là Service (Business Logic)
@Service

// Lombok: tự sinh constructor cho các field final
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    // ============================
    // Inject Repository
    // ============================

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // ==========================================================
    // 1️⃣ LẤY DANH SÁCH WISHLIST THEO USER
    // ==========================================================
    @Override
    public List<WishlistResponse> getWishlistByUserId(Long userId) {

        // Lấy danh sách wishlist theo userId
        List<Wishlist> wishlists = wishlistRepository.findByUserId(userId);

        // Map từ Entity -> DTO trả về cho FE
        return wishlists.stream().map(item -> {

            return WishlistResponse.builder()
                    .id(item.getId()) // ID wishlist
                    .productId(item.getProduct().getId()) // ID sản phẩm
                    .productName(item.getProduct().getName()) // Tên sản phẩm
                    .price(item.getProduct().getPrice()) // Giá
                    .image(item.getProduct().getImage()) // Ảnh
                    .categoryName(
                            item.getProduct().getCategory().getName()
                    ) // Tên danh mục
                    .build();

        }).collect(Collectors.toList());
    }

    // ==========================================================
    // 2️⃣ KIỂM TRA SẢN PHẨM CÓ TRONG WISHLIST KHÔNG
    // ==========================================================
    @Override
    public boolean isFavorite(Long userId, Long productId) {

        // Trả về true nếu tồn tại wishlist (user + product)
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }

    // ==========================================================
    // 3️⃣ THÊM / XÓA WISHLIST (TOGGLE)
    // ==========================================================
    @Override
    @Transactional // 🔥 Quan trọng: đảm bảo thêm/xóa an toàn
    public Map<String, Object> toggleWishlist(Long userId, Long productId) {

        // Kiểm tra xem wishlist đã tồn tại chưa
        Optional<Wishlist> existing =
                wishlistRepository.findByUserIdAndProductId(userId, productId);

        // Response trả về cho FE
        Map<String, Object> response = new HashMap<>();

        if (existing.isPresent()) {
            // ==============================
            // ĐÃ CÓ → XÓA
            // ==============================
            wishlistRepository.delete(existing.get());

            response.put("message", "Removed from wishlist");
            response.put("status", false); // Sau khi xóa → chưa thích

        } else {
            // ==============================
            // CHƯA CÓ → THÊM MỚI
            // ==============================

            // Kiểm tra user tồn tại
            User user = userRepository.findById(userId)
                    .orElseThrow(() ->
                            new RuntimeException("User not found"));

            // Kiểm tra product tồn tại
            Product product = productRepository.findById(productId)
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            // Tạo wishlist mới
            Wishlist wishlist = Wishlist.builder()
                    .user(user)
                    .product(product)
                    .build();

            // Lưu DB
            wishlistRepository.save(wishlist);

            response.put("message", "Added to wishlist");
            response.put("status", true); // Sau khi thêm → đã thích
        }

        // Trả kết quả cho Controller → FE
        return response;
    }
}
