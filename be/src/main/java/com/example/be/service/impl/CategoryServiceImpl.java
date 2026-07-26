package com.example.be.service.impl;

import com.example.be.dto.CategoryDTO;
import com.example.be.entity.Category;
import com.example.be.repository.CategoryRepository;
import com.example.be.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service // Đánh dấu đây là Bean Service để Spring quản lý
@RequiredArgsConstructor // Tự động inject CategoryRepository
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        // [Optional] Tìm theo ID. Nếu không thấy -> Ném lỗi RuntimeException ngay.
        // Controller hoặc GlobalExceptionHandler sẽ bắt lỗi này trả về 404 cho client.
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));
    }

    @Override
    @Transactional // [QUAN TRỌNG] Đảm bảo giao dịch: Nếu lưu thất bại, DB tự động rollback (không lưu rác)
    public Category createCategory(CategoryDTO categoryDTO) {

        // Chuyển đổi từ DTO (dữ liệu gửi lên) -> Entity (dữ liệu lưu DB)
        // Sử dụng Builder Pattern giúp code dễ đọc hơn dùng Constructor dài ngoằng
        Category newCategory = Category.builder()
                .name(categoryDTO.getName())
                .description(categoryDTO.getDescription())
                .build();

        return categoryRepository.save(newCategory);
    }

    @Override
    @Transactional
    public Category updateCategory(Long id, CategoryDTO categoryDTO) {
        // Bước 1: Phải tìm xem bản ghi cũ có tồn tại không đã
        Category existingCategory = getCategoryById(id); // Tái sử dụng hàm trên, đỡ viết lại logic orElseThrow

        // Bước 2: Cập nhật thông tin mới vào bản ghi cũ
        existingCategory.setName(categoryDTO.getName());
        existingCategory.setDescription(categoryDTO.getDescription());

        // Bước 3: Lưu đè lại vào DB
        return categoryRepository.save(existingCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        // Kiểm tra tồn tại trước khi xóa để báo lỗi chính xác
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy danh mục để xóa với ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
}