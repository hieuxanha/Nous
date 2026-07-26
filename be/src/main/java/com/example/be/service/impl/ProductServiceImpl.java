package com.example.be.service.impl;

import com.example.be.dto.ProductDTO;
import com.example.be.dto.ProductResponse;
import com.example.be.entity.Category;
import com.example.be.entity.Product;
import com.example.be.repository.CategoryRepository;
import com.example.be.repository.ProductRepository;
import com.example.be.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;


//     lấy danh sách
    @Override
    public List<ProductResponse> getAllProducts() {
        // 1 lấy danh sách từ entity db
        // 2 chạy qua phần tử  stream
        // biến đổi từng enity thànhb productrespone map
        return productRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

//    lấy chi tiết
    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
        return convertToResponse(product);
    }

    // --- HÀM MAP DỮ LIỆU (QUAN TRỌNG) ---
    private ProductResponse convertToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .sku(product.getSku())
                .name(product.getName())
                .quantity(product.getQuantity())
                .description(product.getDescription())
                .price(product.getPrice())
                .size(product.getSize())
                .image(product.getImage())
                .status(product.getStatus())


                .isNew(true) // Logic tự định nghĩa
                .isSoldOut(product.getQuantity() != null && product.getQuantity() <= 0)

                // 1. Lấy tên danh mục (xử lý null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : "N/A")

                // 2. Lấy ID danh mục (xử lý null)
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .build();
    }

    // --- CÁC HÀM CREATE/UPDATE/DELETE (GIỮ NGUYÊN LOGIC CŨ CỦA BẠN) ---

    @Override
    @Transactional
    public Product createProduct(ProductDTO dto) {
        // 1. Kiểm tra mã SKU trùng
        if (productRepository.existsBySku(dto.getSku())) {
            throw new RuntimeException("Mã SKU '" + dto.getSku() + "' đã tồn tại!");
        }
        // 2. Kiểm tra danh mục có tồn tại không
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại!"));
        // 3. Lưu vào DB
        Product newProduct = Product.builder()
                .sku(dto.getSku())
                .name(dto.getName())
                .quantity(dto.getQuantity())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .size(dto.getSize())
                .image(dto.getImage())
                .status(dto.getStatus())
                .category(category)
                .build();

        return productRepository.save(newProduct);
    }
    // --- CẬP NHẬT ---
    @Override
    @Transactional
    public Product updateProduct(Long id, ProductDTO dto) {
        // Tìm sản phẩm cũ
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Tìm danh mục mới (nếu user đổi danh mục)
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại!"));
        // Cập nhật thông tin
        existingProduct.setName(dto.getName());
        existingProduct.setQuantity(dto.getQuantity());
        existingProduct.setDescription(dto.getDescription());
        existingProduct.setPrice(dto.getPrice());
        existingProduct.setSize(dto.getSize());
        existingProduct.setImage(dto.getImage());
        existingProduct.setStatus(dto.getStatus());
        existingProduct.setCategory(category);

        return productRepository.save(existingProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy sản phẩm để xóa");
        }
        productRepository.deleteById(id);
    }
}