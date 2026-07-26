package com.example.be.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content; // Nội dung bình luận

    private Integer rating; // Số sao (1-5)

    private LocalDateTime createdAt; // Ngày đánh giá

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Người đánh giá


    // Trong class Review
    @Column(nullable = false)
    private Boolean isVisible = true; // Mặc định là hiện

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product; // Sản phẩm được đánh giá

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}