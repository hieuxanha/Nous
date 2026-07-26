package com.example.be.service;

import com.example.be.dto.CheckoutRequest;
import com.example.be.entity.Order;
import org.springframework.data.domain.Page;
import java.util.List;

public interface OrderService {
    Order placeOrder(Long userId, CheckoutRequest request);
    Order updateOrderStatus(Long orderId, String statusStr);

    // Đã chuyển sang Page để phân trang
    Page<Order> getAllOrders(int page, int size);
    Page<Order> getMyOrders(Long userId, int page, int size);

    Order getOrderById(Long id);
    void deleteOrder(Long id);
}