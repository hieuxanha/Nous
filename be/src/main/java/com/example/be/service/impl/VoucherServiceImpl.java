package com.example.be.service.impl;

import com.example.be.dto.VoucherDTO;
import com.example.be.entity.Voucher;
import com.example.be.repository.VoucherRepository;
import com.example.be.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;

    @Override
    public Voucher createVoucher(VoucherDTO dto) {
        if (voucherRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Mã voucher đã tồn tại!");
        }

        Voucher voucher = Voucher.builder()
                .code(dto.getCode().toUpperCase())
                .discountType(Voucher.DiscountType.valueOf(dto.getDiscountType()))
                .discountValue(dto.getDiscountValue())
                .minOrderValue(dto.getMinOrderValue())
                .maxDiscountAmount(dto.getMaxDiscountAmount())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .usageLimit(dto.getUsageLimit())
                .usedCount(0)
                .isActive(true)
                .build();

        return voucherRepository.save(voucher);
    }

    @Override
    public Double calculateDiscount(String code, Double totalOrderPrice) {
        Voucher voucher = voucherRepository.findByCodeAndIsActiveTrue(code)
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại hoặc đã bị khóa!"));

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate())) {
            throw new RuntimeException("Mã giảm giá chưa bắt đầu hoặc đã hết hạn!");
        }

        if (voucher.getUsageLimit() > 0 && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            throw new RuntimeException("Mã giảm giá đã hết lượt sử dụng!");
        }

        if (totalOrderPrice < voucher.getMinOrderValue()) {
            throw new RuntimeException("Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này!");
        }

        double discountAmount = 0.0;
        if (voucher.getDiscountType() == Voucher.DiscountType.FIXED) {
            discountAmount = voucher.getDiscountValue();
        } else {
            discountAmount = totalOrderPrice * (voucher.getDiscountValue() / 100);
            if (voucher.getMaxDiscountAmount() != null && discountAmount > voucher.getMaxDiscountAmount()) {
                discountAmount = voucher.getMaxDiscountAmount();
            }
        }

        return Math.min(discountAmount, totalOrderPrice);
    }

    @Override
    public void incrementUsage(String code) {
        Voucher voucher = voucherRepository.findByCodeAndIsActiveTrue(code).orElse(null);
        if (voucher != null) {
            voucher.setUsedCount(voucher.getUsedCount() + 1);
            voucherRepository.save(voucher);
        }
    }

    @Override
    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @Override
    public void deleteVoucher(Long id) {
        voucherRepository.deleteById(id);
    }

    @Override
    public Voucher updateVoucher(Long id, VoucherDTO dto) {
        // 1. Tìm voucher cũ theo ID
        Voucher existingVoucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Voucher với ID: " + id));

        // 2. Kiểm tra trùng mã Code (Nếu code thay đổi)
        // Nếu code mới khác code cũ VÀ code mới đã tồn tại trong DB -> Lỗi
        if (!existingVoucher.getCode().equalsIgnoreCase(dto.getCode())
                && voucherRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Mã voucher mới đã tồn tại, vui lòng chọn mã khác!");
        }

        // 3. Cập nhật thông tin
        existingVoucher.setCode(dto.getCode().toUpperCase());
        existingVoucher.setDiscountType(Voucher.DiscountType.valueOf(dto.getDiscountType()));
        existingVoucher.setDiscountValue(dto.getDiscountValue());
        existingVoucher.setMinOrderValue(dto.getMinOrderValue());
        existingVoucher.setMaxDiscountAmount(dto.getMaxDiscountAmount());
        existingVoucher.setUsageLimit(dto.getUsageLimit());
        existingVoucher.setStartDate(dto.getStartDate());
        existingVoucher.setEndDate(dto.getEndDate());

        // Lưu ý: Không cập nhật 'usedCount' để giữ nguyên lịch sử sử dụng
        // Nếu muốn cho phép kích hoạt lại voucher đã ẩn thì set isActive
        // existingVoucher.setActive(true);

        return voucherRepository.save(existingVoucher);
    }
}