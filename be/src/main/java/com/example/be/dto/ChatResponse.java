package com.example.be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatResponse {
    private String response; // Nội dung tin nhắn trả lời
    private String type;     // Loại tin nhắn: "TEXT", "PRODUCT_LIST", "ORDER_INFO"
    private Object data;     // Dữ liệu kèm theo (List sản phẩm, Object đơn hàng...)
}