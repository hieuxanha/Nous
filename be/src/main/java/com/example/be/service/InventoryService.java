package com.example.be.service;

import com.example.be.entity.Product;
import com.example.be.entity.StockHistory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page; // Import cái này
import java.util.List;

public interface InventoryService {


    Page<Product> getAllInventory(int page, int size);

    List<Product> getAllInventory();
    void updateStock(Long productId, Integer quantity);
    List<StockHistory> getHistory(Long productId);

    // Hàm logic cốt lõi: Thay đổi kho và Ghi lịch sử
    @Transactional
    void changeStock(Long productId, int amount, String reason);
}
