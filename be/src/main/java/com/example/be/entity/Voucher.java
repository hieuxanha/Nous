package com.example.be.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mã code (VD: SALE50, TET2025) - Unique
    @Column(nullable = false, unique = true)
    private String code;

    // Loại giảm giá: PERCENT (Phần trăm) hoặc FIXED (Số tiền cố định)
    @Enumerated(EnumType.STRING)
    private DiscountType discountType;

    // Giá trị giảm (VD: 10 nếu là %, 50000 nếu là FIXED)
    @Column(nullable = false)
    private Double discountValue;

    // Đơn hàng tối thiểu để áp dụng mã
    @Column(name = "min_order_value")
    private Double minOrderValue;

    // Số tiền giảm tối đa (Chỉ dùng cho loại PERCENT. VD: Giảm 10% nhưng tối đa 50k)
    @Column(name = "max_discount_amount")
    private Double maxDiscountAmount;

    // Ngày bắt đầu và kết thúc
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    // Số lượng mã giới hạn
    private Integer usageLimit;

    // Số lượng đã dùng
    private Integer usedCount;

    // Trạng thái hoạt động
    private Boolean isActive;

    public enum DiscountType {
        PERCENT, FIXED
    }
}