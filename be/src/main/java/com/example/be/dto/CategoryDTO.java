package com.example.be.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data // Tự động sinh Getter, Setter, toString...
public class CategoryDTO {

    // [VALIDATION] Annotation này đảm bảo tên danh mục không được phép Rỗng hoặc Null
    // Nếu Angular gửi lên "", Server sẽ chặn lại ngay và trả về lỗi 400 Bad Request
    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;

    private String description;
}