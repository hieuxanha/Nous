package com.example.be.service;


import com.example.be.dto.AddToCartRequest;
import com.example.be.dto.CartDTO;

public interface CartService {

    // Lấy giỏ hàng của user
    CartDTO getCartByUser(Long userId);

    // Thêm sản phẩm vào giỏ
    CartDTO addToCart(Long userId, AddToCartRequest request);

    CartDTO updateQuantity(Long userId, Long cartItemId,int quantity);

    CartDTO removeItem(Long userId, Long cartItemId);


}
