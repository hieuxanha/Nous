package com.example.be.service.impl;

import com.example.be.dto.CheckoutRequest;
import com.example.be.entity.*;
import com.example.be.entity.Order.OrderStatus;
import com.example.be.repository.*;
import com.example.be.service.InventoryService;
import com.example.be.service.OrderService;
import com.example.be.service.VoucherService; // Import VoucherService Interface
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
//aa
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final InventoryService inventoryService;

    // Inject VoucherService (Interface)
    private final VoucherService voucherService;

    // 1. ĐẶT HÀNG (Đã cập nhật logic Voucher)
    @Override
    @Transactional
    public Order placeOrder(Long userId, CheckoutRequest request) {
        // [1] Lấy User và Giỏ hàng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng không thể để trống");
        }

        // --- BƯỚC 1: TÍNH TỔNG TIỀN GỐC (ORIGINAL PRICE) TRƯỚC ---
        double originalPrice = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        // Tạo đối tượng Order tạm để gán vào OrderItem (chưa lưu DB vội)
        Order orderBuilder = new Order();
        // [2] DUYỆT QUA TỪNG SẢN PHẨM TRONG GIỎ
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            // Check tồn kho
            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ số lượng");
            }

            // Cộng dồn giá gốc
            originalPrice += (product.getPrice() * cartItem.getQuantity());

            // Tạo OrderItem
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .size(cartItem.getSize())
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .productImage(product.getImage())
                    .build();

            orderItems.add(orderItem);
        }

        // --- BƯỚC 2: TÍNH GIẢM GIÁ (VOUCHER) ---
        double discountAmount = 0.0;
        String voucherCode = request.getVoucherCode();

        if (voucherCode != null && !voucherCode.trim().isEmpty()) {
            // Gọi VoucherService để tính tiền giảm
            discountAmount = voucherService.calculateDiscount(voucherCode, originalPrice);

            // Cập nhật lượt dùng voucher
            voucherService.incrementUsage(voucherCode);
        }

        double finalPrice = originalPrice - discountAmount;

        // --- BƯỚC 3: LƯU ORDER VÀO DB ---
        Order order = Order.builder()
                .user(user)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .district(request.getDistrict())
                .ward(request.getWard())
                .paymentMethod(request.getPaymentMethod())
                .status(OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())

                // Lưu các giá trị tiền
                .originalPrice(originalPrice)
                .discountAmount(discountAmount)
                .totalPrice(finalPrice) // totalPrice bây giờ là giá phải trả cuối cùng
                .voucherCode(voucherCode)
                .build();

        Order savedOrder = orderRepository.save(order);

        // --- BƯỚC 4: LƯU ORDER ITEMS ---
        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder); // Gán ID order đã lưu vào item
        }
        orderItemRepository.saveAll(orderItems);
        savedOrder.setOrderItems(orderItems); // Set lại list để trả về Frontend đầy đủ

        // --- BƯỚC 5: XÓA GIỎ HÀNG ---
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    // 2. CẬP NHẬT TRẠNG THÁI (Giữ nguyên)
    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, String statusStr) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
// Trạng thái cũ
        OrderStatus oldStatus = order.getStatus();
        // Trạng thái mới (Admin gửi lên)
        OrderStatus newStatus;

        try {
            newStatus = OrderStatus.valueOf(statusStr);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Trạng thái không hợp lệ");
        }
// Không đổi thì thôi
        if (oldStatus == newStatus) return order;

        boolean isOldDeducted = isStockDeductedStatus(oldStatus);
        boolean isNewDeducted = isStockDeductedStatus(newStatus);




        // Trừ kho (Pending -> Confirmed)
        if (!isOldDeducted && isNewDeducted) {
            for (OrderItem item : order.getOrderItems()) {
                inventoryService.changeStock(item.getProduct().getId(), -item.getQuantity(), "Xác nhận đơn hàng #" + orderId);
            }
        }

        // Hoàn kho (Confirmed -> Cancelled/Pending)
        if (isOldDeducted && !isNewDeducted) {
            for (OrderItem item : order.getOrderItems()) {
                inventoryService.changeStock(item.getProduct().getId(), item.getQuantity(), "Hủy/Hoàn đơn hàng #" + orderId);
            }
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    // 3. LẤY TẤT CẢ ĐƠN HÀNG (Giữ nguyên)

    @Override
    public Page<Order> getAllOrders(int page, int size) {
        // Sắp xếp đơn hàng mới nhất lên đầu (id DESC)
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return orderRepository.findAll(pageable);
    }

    // 4. LẤY CỦA TÔI (Giữ nguyên)
    @Override
    public Page<Order> getMyOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return orderRepository.findByUserId(userId, pageable);
    }

    // 5. LẤY CHI TIẾT ĐƠN HÀNG (Giữ nguyên)
    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
    }

    // 6. XÓA ĐƠN HÀNG (Giữ nguyên)
    @Override
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Đơn hàng không tồn tại để xóa");
        }
        try {
            orderRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa đơn hàng này (Có thể do ràng buộc dữ liệu)");
        }
    }

    private boolean isStockDeductedStatus(OrderStatus status) {
        return status == OrderStatus.CONFIRMED || status == OrderStatus.SHIPPING || status == OrderStatus.COMPLETED;
    }
}