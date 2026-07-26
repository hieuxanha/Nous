package com.example.be.controller;

import com.example.be.dto.ProductDTO;
import com.example.be.dto.ProductResponse;
import com.example.be.entity.Product;
import com.example.be.repository.ProductRepository;
import com.example.be.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") // Cho phép Angular gọi API
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository; // [LƯU Ý] Gọi trực tiếp Repo ở đây cho các hàm tìm kiếm đơn giản

    // --- KHU VỰC PUBLIC (Ai cũng xem được) ---

    // 1. Lấy tất cả sản phẩm (Trả về DTO Response đã được xử lý đẹp đẽ)
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // 2. Xem chi tiết 1 sản phẩm
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // 3. Tìm kiếm sản phẩm theo tên (Dùng cho thanh Search bar)
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        // Gọi thẳng xuống Repo để chạy câu lệnh SQL tìm kiếm
        List<Product> products = productRepository.searchByName(keyword);
        return ResponseEntity.ok(products);
    }

    // 4. Lọc sản phẩm theo danh mục (Khi bấm vào menu danh mục bên trái)
    @GetMapping("/category/{id}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long id) {
        List<Product> products = productRepository.findByCategoryId(id);
        return ResponseEntity.ok(products);
    }

    // --- KHU VỰC ADMIN (Phải có quyền ROLE_ADMIN) ---

    // 5. Thêm mới
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // Chốt chặn bảo mật
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        Product newProduct = productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);
    }

    // 6. Cập nhật
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                 @Valid @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.updateProduct(id, productDTO));
    }

    // 7. Xóa
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        // Trả về JSON chuẩn để tránh lỗi Frontend
        return ResponseEntity.ok(Collections.singletonMap("message", "Xóa sản phẩm thành công"));
    }
}
