package com.example.be.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories") // Tên bảng trong DB là "categories"
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên danh mục không được để trống và không được trùng nhau
    @Column(nullable = false, unique = true)
    private String name;

    // Mô tả có thể để trống, tôi set độ dài tối đa 500 ký tự (mặc định là 255)
    @Column(length = 500)
    private String description;
}