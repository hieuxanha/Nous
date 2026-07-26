package com.example.be.repository;

import com.example.be.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    // Tìm voucher bằng mã code và phải đang active
    Optional<Voucher> findByCodeAndIsActiveTrue(String code);

    // Kiểm tra mã có tồn tại không
    boolean existsByCode(String code);
}