package com.example.be.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String sku;
    private String name;
    private Integer quantity;
    private String description;
    private Double price;
    private String size;   // Lưu chuỗi "S,M,L"
    private String image;
    private String status;
    private boolean isNew;
    private boolean isSoldOut;

    // --- QUAN TRỌNG: Cần cả 2 trường này ---
    private String categoryName; // Để hiển thị lên bảng (Table)
    private Long categoryId;     // Để bind vào Dropdown khi Sửa (Edit)
}