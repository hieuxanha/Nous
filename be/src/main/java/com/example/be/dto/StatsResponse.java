package com.example.be.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class StatsResponse {
    private List<KpiDTO> kpis;
    private List<RevenueChartDTO> revenueChart;
    private List<CategoryStatDTO> categoryStats;
    private List<TopProductDTO> topProducts;

    @Data
    @Builder
    public static class KpiDTO {
        private String label;
        private String value;
        private double percent;
        private boolean isIncrease;
        private String type; // Để frontend map màu (REVENUE, PROFIT, ORDERS, RETURN)
    }

    @Data
    @Builder
    public static class RevenueChartDTO {
        private String label; // T1, T2...
        private double percent; // Chiều cao cột
        private String fullValue; // Giá trị hiển thị tooltip
    }

    @Data
    @Builder
    public static class CategoryStatDTO {
        private String name;
        private double percent;
        private String value;
    }

    @Data
    @Builder
    public static class TopProductDTO {
        private String name;
        private String sku;
        private String image;
        private int sold;
        private int stock;
        private String revenue;
    }
}