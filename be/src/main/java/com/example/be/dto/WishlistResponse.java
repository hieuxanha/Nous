package com.example.be.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistResponse {
    private Long id;            // ID của dòng wishlist (để xóa)
    private Long productId;     // ID sản phẩm (để click vào xem chi tiết)
    private String productName;
    private Double price;
    // HAI TRƯỜNG BẠN CẦN ĐÂY:
    private String image;
    private String categoryName;
}
