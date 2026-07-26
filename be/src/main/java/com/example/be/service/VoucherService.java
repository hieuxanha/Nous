package com.example.be.service;

import com.example.be.dto.VoucherDTO;
import com.example.be.entity.Voucher;

import java.util.List;

public interface VoucherService {
    // Tạo mã mới
    Voucher createVoucher(VoucherDTO dto);

    // Tính toán số tiền giảm giá
    Double calculateDiscount(String code, Double totalOrderPrice);

    // Tăng lượt sử dụng sau khi đặt hàng thành công
    void incrementUsage(String code);

    List<Voucher> getAllVouchers();
    void deleteVoucher(Long id);
    Voucher updateVoucher(Long id, VoucherDTO dto);
}