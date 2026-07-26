package com.example.be.service;

import com.example.be.dto.CategoryDTO;
import com.example.be.entity.Category;
import java.util.List;

// Interface định nghĩa các hành động mà hệ thống CẦN PHẢI CÓ
// Giúp code lỏng lẻo, dễ bảo trì và thay thế logic sau này mà không sửa Controller
public interface CategoryService {

    List<Category> getAllCategory();

    Category getCategoryById(Long id);

    Category createCategory(CategoryDTO categoryDTO);

    Category updateCategory(Long id, CategoryDTO categoryDTO);

    void deleteCategory(Long id);
}