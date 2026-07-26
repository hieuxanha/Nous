package com.example.be.dto;

import lombok.Data;

@Data
public class CheckoutRequest {
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String district;
    private String ward;
    private String paymentMethod;
    // 'cod', 'zalopay', 'banking'
    private String voucherCode;
}