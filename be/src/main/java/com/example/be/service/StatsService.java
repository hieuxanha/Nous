package com.example.be.service;

import com.example.be.dto.StatsResponse;
import com.example.be.repository.OrderItemRepository;
import com.example.be.repository.OrderRepository;
import com.example.be.repository.projection.StatsProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public StatsResponse getStats(String filter) {

        // ===== 1. KPI =====
        Double totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) totalRevenue = 0.0;

        Long totalOrders = orderRepository.countTotalOrders();
        Double netProfit = totalRevenue * 0.3;

        List<StatsResponse.KpiDTO> kpis = new ArrayList<>();
        kpis.add(StatsResponse.KpiDTO.builder()
                .label("Tổng doanh thu")
                .value(formatCurrency(totalRevenue))
                .percent(10.5)
                .isIncrease(true)
                .type("REVENUE")
                .build());

        kpis.add(StatsResponse.KpiDTO.builder()
                .label("Lợi nhuận ròng")
                .value(formatCurrency(netProfit))
                .percent(5.2)
                .isIncrease(true)
                .type("PROFIT")
                .build());

        kpis.add(StatsResponse.KpiDTO.builder()
                .label("Tổng đơn hàng")
                .value(String.valueOf(totalOrders))
                .percent(2.1)
                .isIncrease(false)
                .type("ORDERS")
                .build());

        kpis.add(StatsResponse.KpiDTO.builder()
                .label("Tỉ lệ hoàn hàng")
                .value("0%")
                .percent(0)
                .isIncrease(false)
                .type("RETURN")
                .build());

        // ===== 2. BIỂU ĐỒ DOANH THU (FIXED SCALE) =====
        int currentYear = LocalDate.now().getYear();
        List<StatsProjection.MonthlyRevenue> rawData =
                orderRepository.getMonthlyRevenue(currentYear);

        // 🔥 SCALE CỐ ĐỊNH 10 TRIỆU
        double scaleBaseline = 10_000_000.0;

        List<StatsResponse.RevenueChartDTO> revenueChart = new ArrayList<>();

        for (int i = 1; i <= 12; i++) {
            final int month = i; // 🔥 FIX

            double value = rawData.stream()
                    .filter(d -> d.getMonth() == month)
                    .mapToDouble(StatsProjection.MonthlyRevenue::getAmount)
                    .findFirst()
                    .orElse(0.0);

            double percent = (value / scaleBaseline) * 100;

            // Hiển thị tối thiểu nếu có doanh thu
            if (value > 0 && percent < 8) percent = 8;
            if (percent > 100) percent = 100;

            revenueChart.add(StatsResponse.RevenueChartDTO.builder()
                    .label("T" + i)
                    .percent(percent)
                    .fullValue(formatCurrency(value))
                    .build());
        }

        // ===== 3. TOP SẢN PHẨM =====
        List<StatsProjection.TopProduct> rawTopProducts =
                orderItemRepository.findTopSellingProducts(PageRequest.of(0, 5));

        List<StatsResponse.TopProductDTO> topProducts = rawTopProducts.stream().map(p ->
                StatsResponse.TopProductDTO.builder()
                        .name(p.getName())
                        .sku(p.getSku())
                        .image(p.getImage())
                        .sold(p.getSold())
                        .stock(p.getStock())
                        .revenue(formatCurrency(p.getRevenue()))
                        .build()
        ).toList();

        // ===== 4. DOANH THU THEO DANH MỤC =====
        List<StatsProjection.CategoryRevenue> rawCatStats =
                orderItemRepository.getRevenueByCategory();

        List<StatsResponse.CategoryStatDTO> categoryStats = new ArrayList<>();

        for (StatsProjection.CategoryRevenue c : rawCatStats) {
            double percent = totalRevenue > 0
                    ? (c.getRevenue() / totalRevenue) * 100
                    : 0;

            categoryStats.add(StatsResponse.CategoryStatDTO.builder()
                    .name(c.getCategoryName())
                    .value(formatCurrency(c.getRevenue()))
                    .percent(Math.round(percent * 10.0) / 10.0)
                    .build());
        }

        return StatsResponse.builder()
                .kpis(kpis)
                .revenueChart(revenueChart)
                .categoryStats(categoryStats)
                .topProducts(topProducts)
                .build();
    }

    private String formatCurrency(Double amount) {
        if (amount == null) return "0đ";
        if (amount >= 1_000_000_000)
            return String.format("%.1f Tỷ", amount / 1_000_000_000);
        if (amount >= 1_000_000)
            return String.format("%.0f Tr", amount / 1_000_000);
        return String.format("%,.0fđ", amount);
    }
}
