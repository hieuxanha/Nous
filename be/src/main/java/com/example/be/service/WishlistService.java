package com.example.be.service;

import com.example.be.dto.WishlistResponse;

import java.util.List;
import java.util.Map;

public interface WishlistService {

    List<WishlistResponse> getWishlistByUserId(Long userId);

    boolean isFavorite(Long userId, Long productId);

    Map<String, Object> toggleWishlist(Long userId, Long productId);}
