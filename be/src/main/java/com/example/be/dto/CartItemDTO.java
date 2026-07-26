package com.example.be.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemDTO {
    private Long id;          // ID của CartItem (để xóa/sửa)
    private Long productId;   // ID của Product
    private String name;
    private String sku;
    private String image;
    private Double price;
    private Integer quantity;
    private Double totalPrice; // price * quantity

    private String categoryName;
    private String size;
}