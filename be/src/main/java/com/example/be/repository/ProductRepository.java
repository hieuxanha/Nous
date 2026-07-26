package com.example.be.repository;

import com.example.be.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Kiểm tra SKU tồn tại (Spring Data JPA tự sinh câu SQL)
    boolean existsBySku(String productCode);

    // Tìm list sản phẩm thuộc 1 danh mục cụ thể
    List<Product> findByCategoryId(Long categoryId);

    // --- TÌM KIẾM TÙY CHỈNH (Custom Query) ---
    // JPQL: Truy vấn trên Entity (Product p) chứ không phải tên bảng (products)
    // LOWER(...): Chuyển tất cả về chữ thường để tìm không phân biệt hoa thường
    // CONCAT('%', :keyword, '%'): Tìm chữ nằm ở giữa (Ví dụ: gõ "phone" tìm ra "iPhone 15")
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByName(@Param("keyword") String keyword);
}