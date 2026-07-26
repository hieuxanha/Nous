package com.example.be.repository;

import com.example.be.entity.Order;
import com.example.be.repository.projection.StatsProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByUserId(Long userId, Pageable pageable);

    // 1. KPI: Tổng doanh thu
    // SỬA: o.totalMoney -> o.totalPrice (hoặc o.finalPrice tùy logic bạn muốn tính)
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status = 'COMPLETED'")
    Double sumTotalRevenue();


    // 2. Query đếm đơn hàng
    @Query("SELECT COUNT(o) FROM Order o")
    Long countTotalOrders();

    // 3. KPI: Số lượng đơn thành công
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'COMPLETED'")
    Long countCompletedOrders();

    // 4. BIỂU ĐỒ: Doanh thu theo tháng
    // SỬA: o.totalMoney -> o.totalPrice
    @Query("SELECT MONTH(o.orderDate) as month, SUM(o.totalPrice) as amount " +
            "FROM Order o " +
            "WHERE YEAR(o.orderDate) = :year AND o.status = 'COMPLETED' " +
            "GROUP BY MONTH(o.orderDate)")
    List<StatsProjection.MonthlyRevenue> getMonthlyRevenue(@Param("year") int year);
}