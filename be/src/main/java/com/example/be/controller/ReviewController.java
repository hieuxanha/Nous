package com.example.be.controller;

// DTO nhận dữ liệu từ FE khi thêm review
import com.example.be.dto.ReviewRequest;

// DTO trả dữ liệu review về cho FE
import com.example.be.dto.ReviewResponse;

// Service xử lý logic nghiệp vụ
import com.example.be.service.ReviewService;

// Lombok: tự sinh constructor cho field final
import lombok.RequiredArgsConstructor;

// Trả HTTP status + body
import org.springframework.http.ResponseEntity;

// Phân quyền (Admin/User)
import org.springframework.security.access.prepost.PreAuthorize;

// Annotation REST
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController // 👉 Controller REST (trả JSON)
@RequestMapping("/api/reviews") // 👉 URL gốc: /api/reviews
@RequiredArgsConstructor // 👉 Inject ReviewService qua constructor
@CrossOrigin("*") // 👉 Cho FE gọi API
public class ReviewController {

    // Inject service
    private final ReviewService reviewService;

    // ==================================================
    // USER: THÊM ĐÁNH GIÁ (KHÔNG CẦN ADMIN)
    // ==================================================

    // POST /api/reviews
    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            @RequestBody ReviewRequest request // JSON từ FE
    ) {
        // Gọi service xử lý và trả kết quả
        return ResponseEntity.ok(reviewService.addReview(request));
    }

    // ==================================================
    // PUBLIC: XEM REVIEW THEO SẢN PHẨM (AI CŨNG XEM ĐƯỢC)
    // ==================================================

    // GET /api/reviews/product/{productId}
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(
            @PathVariable Long productId // Lấy productId từ URL
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewsByProduct(productId)
        );
    }

    // ==================================================
    // ADMIN ONLY: CÁC API QUẢN LÝ REVIEW
    // ==================================================

    // GET /api/reviews
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // 👉 Chỉ Admin
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // DELETE /api/reviews/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // 👉 Chỉ Admin
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build(); // HTTP 204
    }

    // PUT /api/reviews/{id}/toggle
    @PutMapping("/{id}/toggle")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> toggleReviewVisibility(@PathVariable Long id) {
        reviewService.toggleVisibility(id);
        return ResponseEntity.ok(
                Collections.singletonMap("message", "Cập nhật trạng thái thành công")
        );
    }
}
