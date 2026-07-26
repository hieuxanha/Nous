package com.example.be.entity;


import jakarta.persistence.*;
        import lombok.*;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne(fetch = FetchType.EAGER) // Eager để lấy luôn thông tin Product (ảnh, giá, sku)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "product_name")
    private String productName;

    private Integer quantity;
    @Column(name = "size") // Có thể thêm @Column nếu muốn rõ ràng
    private String size;


}