package com.example.be.service.impl;

import com.example.be.dto.AddToCartRequest;
import com.example.be.dto.CartDTO;
import com.example.be.dto.CartItemDTO;
import com.example.be.entity.Cart;
import com.example.be.entity.CartItem;
import com.example.be.entity.Product;
import com.example.be.entity.User;
import com.example.be.repository.CartItemRepository;
import com.example.be.repository.CartRepository;
import com.example.be.repository.ProductRepository;
import com.example.be.repository.UserRepository;
import com.example.be.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Objects; // Quan trọng để so sánh chuỗi

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public CartDTO getCartByUser(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return convertToDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO addToCart(Long userId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 1. Tìm sản phẩm trong giỏ có CÙNG ID và CÙNG SIZE
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item ->
                        item.getProduct().getId().equals(product.getId()) &&
                                Objects.equals(item.getSize(), request.getSize()) // So sánh Size
                )
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            // 2. Nếu chưa có, tạo mới và LƯU SIZE VÀO
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .productName(product.getName())     // Lấy tên
                    .size(request.getSize()) // <--- QUAN TRỌNG: Lưu size khách chọn
                    .build();
            cart.addItem(newItem);
        }

        Cart savedCart = cartRepository.save(cart);
        return convertToDTO(savedCart);
    }

    @Override
    @Transactional
    public CartDTO updateQuantity(Long userId, Long cartItemId, int quantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Access Denied");
        }

        if (quantity <= 0) {
            cart.removeItem(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return getCartByUser(userId);
    }

    @Override
    @Transactional
    public CartDTO removeItem(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Access Denied");
        }

        cart.removeItem(item);
        cartItemRepository.delete(item);
        return getCartByUser(userId);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    // 3. Hàm chuyển đổi dữ liệu trả về Frontend
    private CartDTO convertToDTO(Cart cart) {
        List<CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(item -> CartItemDTO.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .name(item.getProduct().getName())
                        .sku(item.getProduct().getSku())
                        .image(item.getProduct().getImage())
                        .price(item.getProduct().getPrice())
                        .quantity(item.getQuantity())
                        .totalPrice(item.getProduct().getPrice() * item.getQuantity())

                        // --- SỬA Ở ĐÂY: Lấy size từ CartItem ---
                        .size(item.getSize())
                        // -------------------------------------

                        // Lấy danh mục
                        .categoryName(item.getProduct().getCategory() != null ? item.getProduct().getCategory().getName() : "")
                        .build())
                .collect(Collectors.toList());

        double totalCartPrice = itemDTOs.stream().mapToDouble(CartItemDTO::getTotalPrice).sum();
        int totalItemCount = itemDTOs.stream().mapToInt(CartItemDTO::getQuantity).sum();

        return CartDTO.builder()
                .id(cart.getId())
                .items(itemDTOs)
                .totalCartPrice(totalCartPrice)
                .totalItemCount(totalItemCount)
                .build();
    }
}