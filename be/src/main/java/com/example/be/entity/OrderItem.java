package com.example.be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // 1. Import dòng này
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore // 2. THÊM DÒNG NÀY (Ngắt vòng lặp JSON)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "product_name")
    private String productName;

    private String size;
    private Integer quantity;
    private Double price;


    // Thêm trường ảnh nếu chưa có để hiển thị ở Frontend
    @Column(name = "product_image")
    private String productImage;
}