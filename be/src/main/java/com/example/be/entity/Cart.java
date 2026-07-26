package com.example.be.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Một user chỉ có 1 giỏ hàng active
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
//    theo

    // Danh sách sản phẩm trong giỏ
    // orphanRemoval = true: Khi xóa item khỏi list này, nó sẽ xóa luôn trong DB
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<CartItem> items = new HashSet<>();

    // Helper method để thêm item
    public void addItem(CartItem item) {
        this.items.add(item);
        item.setCart(this);
    }

    // Helper method để xóa item
    public void removeItem(CartItem item) {
        this.items.remove(item);
        item.setCart(null);
    }
}