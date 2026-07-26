package com.example.be.controller;

import com.example.be.dto.CategoryDTO;
import com.example.be.entity.Category;
import com.example.be.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/categories")
// [QUAN TRỌNG] Tự động tạo Constructor cho các biến final (categoryService)
// Thay thế cho việc phải viết: public CategoryController(CategoryService...)
@RequiredArgsConstructor
// [QUAN TRỌNG] Mở cửa cho Angular ở cổng 4200 gọi vào mà không bị chặn
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {

    private final CategoryService categoryService;

    // --- LẤY TẤT CẢ ---
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        // Trả về danh sách kèm mã status 200 OK
        return ResponseEntity.ok(categoryService.getAllCategory());
    }

    // --- LẤY CHI TIẾT THEO ID ---
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    // --- THÊM MỚI (CHỈ ADMIN) ---
    @PostMapping
    // [BẢO MẬT] Kiểm tra Token xem user có quyền ROLE_ADMIN không?
    // Nếu không -> Trả về lỗi 403 Forbidden ngay lập tức.
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    // @Valid: Kiểm tra dữ liệu đầu vào (CategoryDTO) có hợp lệ không (ví dụ: tên có bị rỗng không?)
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        try {
            Category newCategory = categoryService.createCategory(categoryDTO);
            // Trả về đối tượng vừa tạo kèm mã 201 Created (Chuẩn RESTful cho việc tạo mới)
            return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
        } catch (Exception e) {
            // [DEBUG] In lỗi ra màn hình console của Server để lập trình viên sửa lỗi
            System.err.println("============ PHÁT HIỆN LỖI 500 TẠI ĐÂY ============");
            e.printStackTrace();
            System.err.println("==================================================");

            // Trả về lỗi dạng JSON để Frontend hiển thị thông báo
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    // --- CẬP NHẬT (CHỈ ADMIN) ---
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id,
                                                   @Valid @RequestBody CategoryDTO categoryDTO) {
        // Logic cập nhật nằm hết trong Service, Controller chỉ nhận kết quả
        Category updatedCategory = categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.ok(updatedCategory);
    }

    // --- XÓA (CHỈ ADMIN) ---
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);

        // [LƯU Ý] Trả về JSON object: { "message": "..." }
        // Nếu trả về chuỗi String trơ trọi, Angular sẽ báo lỗi "HttpErrorResponse syntax error"
        return ResponseEntity.ok(Collections.singletonMap("message", "Xóa danh mục thành công"));
    }
}