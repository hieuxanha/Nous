package com.example.be.service.impl;

import com.example.be.entity.Product;
import com.example.be.entity.StockHistory;
import com.example.be.repository.ProductRepository;
import com.example.be.repository.StockHistoryRepository;
import com.example.be.service.InventoryService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

////////////////////////////////////////////////////////////////////

// Đánh dấu đây là Service
@Service

// Lombok inject repository
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    // ============================
    // Inject Repository
    // ============================
    private final ProductRepository productRepository;
    private final StockHistoryRepository stockHistoryRepository;

    // ==================================================
    // 1️⃣ LẤY DANH SÁCH KHO (PHÂN TRANG)
    // ==================================================
    @Override
    public Page<Product> getAllInventory(int page, int size) {

        // PageRequest:
        // - page: số trang
        // - size: số item mỗi trang
        // - sort: sắp xếp theo ID giảm dần
        return productRepository.findAll(
                PageRequest.of(page, size, Sort.by("id").descending())
        );
    }

    // ==================================================
    // 2️⃣ LẤY TOÀN BỘ KHO (KHÔNG PHÂN TRANG – DÙNG NỘI BỘ)
    // ==================================================
    @Override
    public List<Product> getAllInventory() {
        return productRepository.findAll();
    }

    // ==================================================
    // 3️⃣ LẤY LỊCH SỬ KHO CỦA 1 SẢN PHẨM
    // ==================================================
    @Override
    public List<StockHistory> getHistory(Long productId) {

        // Lấy lịch sử theo productId, mới nhất trước
        return stockHistoryRepository
                .findByProductIdOrderByCreatedAtDesc(productId);
    }

    // ==================================================
    // 4️⃣ ADMIN CẬP NHẬT SỐ LƯỢNG (SET TRỰC TIẾP)
    // ==================================================
    @Override
    @Transactional
    public void updateStock(Long productId, Integer newQuantity) {

        // Kiểm tra sản phẩm tồn tại
        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Sản phẩm không tồn tại"));

        if (newQuantity < 0)
            throw new RuntimeException("Số lượng không hợp lệ");

        // ============================
        // TÍNH CHÊNH LỆCH
        // ============================
        // VD:
        // Cũ: 10 → Mới: 15 → diff = +5
        // Cũ: 10 → Mới: 8  → diff = -2
        int diff = newQuantity - product.getQuantity();

        // Không thay đổi thì không làm gì
        if (diff == 0) return;

        // Gọi hàm cốt lõi
        this.changeStock(
                productId,
                diff,
                "Admin cập nhật thủ công"
        );
    }

    // ==================================================
    // 5️⃣ LOGIC CỐT LÕI: THAY ĐỔI KHO + GHI LỊCH SỬ
    // ==================================================
    @Override
    @Transactional
    public void changeStock(Long productId, int amount, String reason) {

        // Tìm sản phẩm
        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Sản phẩm không tồn tại"));

        // Tính tồn kho mới
        int newQuantity = product.getQuantity() + amount;

        // Không cho âm kho
        if (newQuantity < 0)
            throw new RuntimeException("Kho không đủ hàng!");

        // ============================
        // 1️⃣ CẬP NHẬT PRODUCT
        // ============================
        product.setQuantity(newQuantity);
        productRepository.save(product);

        // ============================
        // 2️⃣ GHI LỊCH SỬ KHO
        // ============================
        StockHistory history = StockHistory.builder()
                .product(product)
                .changeAmount(amount)          // + hoặc -
                .remainingQuantity(newQuantity)
                .reason(reason)                // Lý do
                .build();

        stockHistoryRepository.save(history);
    }
}
