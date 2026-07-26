package com.example.be.controller;

import com.example.be.dto.VoucherDTO;
import com.example.be.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Import thêm cái này
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
@CrossOrigin("*")
public class VoucherController {

    private final VoucherService voucherService;

    // 1. Tạo Voucher mới -> CHỈ ADMIN
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createVoucher(@RequestBody VoucherDTO dto) {
        try {
            return ResponseEntity.ok(voucherService.createVoucher(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. Lấy danh sách tất cả -> CÔNG KHAI (Ai cũng xem được để hiển thị lên trang chủ)
    // Đã đổi path từ "/admin/all" -> "/all"
    @GetMapping("/all")
    public ResponseEntity<?> getAllVouchers() {
        return ResponseEntity.ok(voucherService.getAllVouchers());
    }

    // 3. Xóa Voucher -> CHỈ ADMIN
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteVoucher(@PathVariable Long id) {
        voucherService.deleteVoucher(id);
        return ResponseEntity.ok("Đã xóa voucher thành công");
    }

    // 4. Update Voucher -> CHỈ ADMIN
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateVoucher(@PathVariable Long id, @RequestBody VoucherDTO dto) {
        try {
            return ResponseEntity.ok(voucherService.updateVoucher(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    // 5. Kiểm tra mã (Checkout) -> CÔNG KHAI (Khách dùng để áp mã)
    @GetMapping("/check")
    public ResponseEntity<?> checkVoucher(@RequestParam String code, @RequestParam Double totalAmount) {
        try {
            Double discount = voucherService.calculateDiscount(code, totalAmount);
            return ResponseEntity.ok(Collections.singletonMap("discountAmount", discount));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }
}