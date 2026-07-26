package com.example.be.service;

import com.example.be.dto.ReviewRequest;
import com.example.be.dto.ReviewResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse addReview(ReviewRequest request);
    List<ReviewResponse> getReviewsByProduct(Long ProductId);

    List<ReviewResponse> getAllReviews(); // Lấy tất cả cho Admin
    void deleteReview(Long id);           // Xóa đánh giá
    void toggleVisibility(Long id); // Hàm mới
}
