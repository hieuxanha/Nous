package com.example.be.repository;

import com.example.be.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    // Lấy danh sách yêu thích của user
    List<Wishlist> findByUserId(Long userId);

    // Kiểm tra xem user đã thích sản phẩm này chưa
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    // Tìm để xóa
    Optional<Wishlist> findByUserIdAndProductId(Long userId, Long productId);
}