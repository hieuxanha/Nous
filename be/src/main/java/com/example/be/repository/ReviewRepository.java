package com.example.be.repository;

import com.example.be.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Lấy danh sách review theo sản phẩm, sắp xếp mới nhất lên đầu
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    // Trong ReviewRepository
    List<Review> findByProductIdAndIsVisibleTrueOrderByCreatedAtDesc(Long productId);
}