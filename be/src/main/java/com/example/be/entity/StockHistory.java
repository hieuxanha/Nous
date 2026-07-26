package com.example.be.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer changeAmount; // Ví dụ: -2 (bán), +10 (nhập)

    private Integer remainingQuantity; // Số lượng tồn sau khi thay đổi

    private String reason; // Lý do: "Đơn hàng #10", "Admin cập nhật", "Hủy đơn"

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}