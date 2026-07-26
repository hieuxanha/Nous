package com.example.be.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewResponse {
    //Dữ liệu trả về cho Frontend
    private Long id;
    private String userName;   // Tên người dùng (Frontend cần)
    private Integer rating;    // Số sao
    private String content;    // Nội dung
    private String date;       // Ngày (đã format dd/MM/yyyy)
    private String avatarChar;
    // Chữ cái đầu của tên (Frontend cần để làm avatar)
    private Boolean isVisible;


    // --- [MỚI] THÊM THÔNG TIN SẢN PHẨM CHO QUẢN LÝ ---
    private Long productId;
    private String productName;
    private String productImage;
}