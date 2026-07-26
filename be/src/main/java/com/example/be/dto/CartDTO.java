package com.example.be.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CartDTO {
    private Long id;
    private List<CartItemDTO> items;
    private Double totalCartPrice;
    private Integer totalItemCount;
}