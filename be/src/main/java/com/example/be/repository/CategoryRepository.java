package com.example.be.repository;

import com.example.be.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Có thể thêm hàm tìm kiếm theo tên nếu cần
     boolean existsByName(String name);
}