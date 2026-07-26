package com.example.be.repository.projection;

public interface StatsProjection {

    // Dùng cho biểu đồ doanh thu theo tháng
    interface MonthlyRevenue {
        Integer getMonth();
        Double getAmount();
    }

    // Dùng cho Top sản phẩm bán chạy
    interface TopProduct {
        String getName();
        String getSku();
        String getImage();
        Integer getSold();
        Integer getStock();
        Double getRevenue();
    }

    // Dùng cho Thống kê theo danh mục
    interface CategoryRevenue {
        String getCategoryName();
        Double getRevenue();
    }
}