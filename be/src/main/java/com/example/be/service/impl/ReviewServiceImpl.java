package com.example.be.service.impl;

import com.example.be.dto.ReviewRequest;
import com.example.be.dto.ReviewResponse;
import com.example.be.entity.Product;
import com.example.be.entity.Review;
import com.example.be.entity.User;
import com.example.be.repository.ProductRepository;
import com.example.be.repository.ReviewRepository;
import com.example.be.repository.UserRepository;
import com.example.be.service.ReviewService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service // 👉 Đánh dấu đây là Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    // Inject repository
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // ==================================================
    // USER: THÊM REVIEW
    // ==================================================
    @Override
    public ReviewResponse addReview(ReviewRequest request) {

        // Kiểm tra user tồn tại
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra product tồn tại
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Tạo entity Review
        Review review = Review.builder()
                .content(request.getContent())
                .rating(request.getRating())
                .user(user)
                .product(product)
                .isVisible(true) // 👉 Mặc định hiển thị
                .build();

        // Lưu DB và map sang Response
        return mapToResponse(reviewRepository.save(review));
    }

    // ==================================================
    // PUBLIC: XEM REVIEW THEO SẢN PHẨM
    // ==================================================
    @Override
    public List<ReviewResponse> getReviewsByProduct(Long productId) {

        // 👉 Chỉ lấy review isVisible = true
        List<Review> reviews =
                reviewRepository.findByProductIdAndIsVisibleTrueOrderByCreatedAtDesc(productId);

        return reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ==================================================
    // ADMIN: XEM TẤT CẢ REVIEW
    // ==================================================
    @Override
    public List<ReviewResponse> getAllReviews() {

        // 👉 Admin xem tất cả (kể cả ẩn)
        List<Review> reviews =
                reviewRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ==================================================
    // ADMIN: XÓA REVIEW
    // ==================================================
    @Override
    public void deleteReview(Long id) {

        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review not found");
        }

        reviewRepository.deleteById(id);
    }

    // ==================================================
    // ADMIN: ẨN / HIỆN REVIEW
    // ==================================================
    @Override
    public void toggleVisibility(Long id) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Đảo trạng thái
        boolean current = review.getIsVisible() != null
                ? review.getIsVisible()
                : true;

        review.setIsVisible(!current);
        reviewRepository.save(review);
    }

    // ==================================================
    // HELPER: MAP ENTITY -> RESPONSE
    // ==================================================
    private ReviewResponse mapToResponse(Review review) {

        // Lấy tên user
        String fullName = review.getUser().getFullName();

        // Lấy chữ cái đầu làm avatar
        String avatarChar = (fullName != null && !fullName.isEmpty())
                ? String.valueOf(fullName.charAt(0)).toUpperCase()
                : "U";

        // Format ngày
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        String formattedDate = review.getCreatedAt() != null
                ? review.getCreatedAt().format(formatter)
                : "";

        return ReviewResponse.builder()
                .id(review.getId())
                .userName(fullName)
                .rating(review.getRating())
                .content(review.getContent())
                .date(formattedDate)
                .avatarChar(avatarChar)
                .isVisible(review.getIsVisible())

                // Thông tin sản phẩm
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .productImage(review.getProduct().getImage())
                .build();
    }
}
