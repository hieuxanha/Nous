package com.example.be.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Người đặt hàng (nếu đã đăng nhập)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // --- Thông tin lấy từ Form Checkout ---
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String address; // Địa chỉ cụ thể
    private String city;    // Tỉnh/Thành
    private String district;// Quận/Huyện
    private String ward;    // Phường/Xã

    // --- Thông tin đơn hàng ---
    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "payment_method")
    private String paymentMethod; // COD, BANKING, ZALOPAY

    @Enumerated(EnumType.STRING)
    private OrderStatus status; // PENDING, SHIPPING, COMPLETED, CANCELLED

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    // Danh sách chi tiết sản phẩm trong đơn
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> orderItems = new ArrayList<>();


    // Tổng tiền gốc (Tổng giá các món hàng)
    @Column(name = "original_price")
    private Double originalPrice;

    // Số tiền được giảm
    @Column(name = "discount_amount")
    private Double discountAmount;

    // Tổng tiền phải thanh toán sau khi trừ giảm giá (Final Price)
    @Column(name = "final_price")
    private Double finalPrice;

    // Lưu mã voucher đã dùng (để đối soát)
    @Column(name = "voucher_code")
    private String voucherCode;

    // Enum trạng thái đơn hàng
    public enum OrderStatus {
        PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED
    }


//
//    PENDING → Đang chờ xử lý
//
//    CONFIRMED → Đã xác nhận
//
//    SHIPPING → Đang giao hàng
//
//    COMPLETED → Hoàn thành
//
//    CANCELLED → Đã hủy
}
