package com.example.be.repository;

import com.example.be.entity.OrderItem;
import com.example.be.repository.projection.StatsProjection;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Tìm tất cả sản phẩm thuộc về một đơn hàng cụ thể (nếu cần dùng sau này)
    List<OrderItem> findByOrderId(Long orderId);
    @Query("SELECT p.name as name, p.sku as sku, p.image as image, p.quantity as stock, " +
            "SUM(oi.quantity) as sold, SUM(oi.price * oi.quantity) as revenue " +
            "FROM OrderItem oi " +
            "JOIN oi.product p " +
            "JOIN oi.order o " +
            "WHERE o.status = 'COMPLETED' " +
            "GROUP BY p.id, p.name, p.sku, p.image, p.quantity " +
            "ORDER BY sold DESC")
    List<StatsProjection.TopProduct> findTopSellingProducts(Pageable pageable);

    // 2. THỐNG KÊ THEO DANH MỤC
    // Join OrderItem -> Product -> Category
    @Query("SELECT c.name as categoryName, SUM(oi.price * oi.quantity) as revenue " +
            "FROM OrderItem oi " +
            "JOIN oi.product p " +
            "JOIN p.category c " +
            "JOIN oi.order o " +
            "WHERE o.status = 'COMPLETED' " +
            "GROUP BY c.id, c.name")
    List<StatsProjection.CategoryRevenue> getRevenueByCategory();

}