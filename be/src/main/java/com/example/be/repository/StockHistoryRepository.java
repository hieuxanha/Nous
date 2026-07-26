package com.example.be.repository;

import com.example.be.entity.StockHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockHistoryRepository extends JpaRepository<StockHistory, Long> {
    // Lấy lịch sử của 1 sản phẩm, mới nhất lên đầu
    List<StockHistory> findByProductIdOrderByCreatedAtDesc(Long productId);
}