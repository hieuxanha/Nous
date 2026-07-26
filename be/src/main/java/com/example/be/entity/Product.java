package com.example.be.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mã sản phẩm (SKU) - Không được trùng
    @Column(nullable = false, unique = true)
    private String sku;

    // Tên sản phẩm
    @Column(nullable = false)
    private String name;

    // Số lượng tồn kho
    @Column(nullable = false)
    private Integer quantity;

    // Mô tả
    @Column(length = 1000)
    private String description;

    // Giá tiền
    @Column(nullable = false)
    private Double price;

    // Size (Lưu chuỗi "S,M,L")
    private String size;

    // Hình ảnh (URL)
    private String image;

    // Tình trạng
    private String status;

    // Quan hệ với Category
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}