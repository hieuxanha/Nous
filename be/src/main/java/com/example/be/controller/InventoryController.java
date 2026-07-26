package com.example.be.controller;


import com.example.be.entity.Product;
import com.example.be.repository.ProductRepository;
import com.example.be.service.InventoryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin("*")
public class InventoryController {

     private final InventoryService inventoryService;
//

    // 1. Lấy danh sách kho hàng
    // 1. Lấy danh sách kho hàng (Phân trang)
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Page<Product>> getInventory(
            @RequestParam(defaultValue = "0") int page, // Mặc định trang 0
            @RequestParam(defaultValue = "5") int size  // Mặc định 5 sản phẩm
    ){
        return ResponseEntity.ok(inventoryService.getAllInventory(page, size));
    }
    // 2. Cập nhật số lượng tồn kho
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestParam Integer quantity) {
        try {
            inventoryService.updateStock(id, quantity);
            return ResponseEntity.ok(Collections.singletonMap("message", "Cập nhật kho thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }
    // 3. [MỚI] Xem lịch sử kho của 1 sản phẩm
    @GetMapping("/{id}/history")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getStockHistory(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getHistory(id));
    }
}
