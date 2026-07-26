package com.example.be.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VoucherDTO {
    private String code;
    private String discountType; // "PERCENT" hoặc "FIXED"
    private Double discountValue;
    private Double minOrderValue;
    private Double maxDiscountAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer usageLimit;
}