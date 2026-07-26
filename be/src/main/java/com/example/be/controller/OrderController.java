package com.example.be.controller;

import com.example.be.dto.CheckoutRequest;
import com.example.be.entity.Order;
import com.example.be.entity.User;
import com.example.be.repository.UserRepository;
import com.example.be.service.OrderService;
import com.example.be.service.PaymentService; // <--- 1. Import PaymentService
import jakarta.servlet.http.HttpServletRequest; // <--- 2. Import HttpServletRequest
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;
    private final PaymentService paymentService; // <--- 3. Inject PaymentService

    // 1. Đặt hàng (Checkout)
    // SỬA: Thêm HttpServletRequest vào tham số để VNPAY lấy IP
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request, HttpServletRequest httpRequest) {
        // [1] Lấy ID người dùng đang đăng nhập từ Token (Bảo mật)
        Long userId = getCurrentUserId();
        try {
            // [2] Gọi Service để tạo đơn hàng trong Database (Trạng thái: PENDING)
            // Lúc này đơn hàng đã được lưu, kho có thể chưa bị trừ tùy logic của bạn.

            Order order = orderService.placeOrder(userId, request);
               // [3] Chuẩn bị dữ liệu trả về
            Map<String, Object> response = new HashMap<>();
            response.put("id", order.getId());
            response.put("message", "Đặt hàng thành công");
            response.put("order", order);

             // [4] XỬ LÝ THANH TOÁN ONLINE (VNPAY)
            // Nếu user chọn VNPAY, server không chỉ trả về "Thành công" mà phải trả về một đường Link.
            // Frontend sẽ mở đường Link này để user nhập thẻ ngân hàng.
            if ("VNPAY".equalsIgnoreCase(request.getPaymentMethod())) {
                long amount = order.getTotalPrice() != null ? order.getTotalPrice().longValue() : 0;                String orderInfo = "Thanh toan don hang #" + order.getId();

                // Gọi PaymentService để lấy URL
                String paymentUrl = paymentService.createVnPayPayment(httpRequest, amount, orderInfo);



                // Trả về URL cho Frontend tự redirect
                response.put("paymentUrl", paymentUrl);
            }
// [BƯỚC 3]: ĐÂY CHÍNH LÀ CHỖ KẾT THÚC CỦA COD !!!
            // Nếu không lọt vào cái if("VNPAY") ở trên, code sẽ chạy thẳng xuống đây.
            // Server trả về JSON thông báo thành công luôn mà không có "paymentUrl"
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    // 2. Lấy tất cả đơn hàng (Admin)
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Page<Order>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size));
    }
    // 3. Lấy đơn hàng của tôi
    @GetMapping("/my-orders")
    public ResponseEntity<Page<Order>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(orderService.getMyOrders(userId, page, size));
    }

    // 4. Lấy chi tiết đơn hàng
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. Cập nhật trạng thái (Admin)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            // Gọi service để đổi trạng thái (Ví dụ: PENDING -> SHIPPING)
            // Logic trừ kho sẽ nằm trong service này.
            return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Trạng thái không hợp lệ");
        }
    }

    // 6. Hủy đơn hàng nhanh
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id){
        try{
            return ResponseEntity.ok(orderService.updateOrderStatus(id, "CANCELLED"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    // 7. Xóa đơn hàng (Admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id){
        try{
            orderService.deleteOrder(id);
            return ResponseEntity.ok(Collections.singletonMap("message","Xóa đơn hàng thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Không thể xóa đơn hàng này"));
        }
    }

    // Helper: Lấy ID user từ token
    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        return user.getId();
    }
}