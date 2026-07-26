package com.example.be.dto;

import lombok.Data;

@Data
public class ReviewRequest {
//    Dữ liệu FE gửi lên khi thêm review
    private Long userId;
    private Long productId;
    private Integer rating;
    private String content;
}