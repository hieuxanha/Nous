package com.example.be.dto;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Long productId;
    private Integer quantity;
    private String size;
    private String categoryName;


}