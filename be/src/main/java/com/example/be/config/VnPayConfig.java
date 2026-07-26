package com.example.be.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Configuration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Configuration
public class VnPayConfig {
    // URL môi trường kiểm thử (Sandbox)
    public static String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    // URL trả về khi thanh toán xong (Frontend)
    public static String vnp_ReturnUrl = "http://localhost:4200/payment-success";

    // --- CẬP NHẬT QUAN TRỌNG: Thêm .trim() để xóa khoảng trắng thừa ---
    public static String vnp_TmnCode = "1PEP594H".trim();
    public static String vnp_HashSecret = "AGSVX4KNUCYNDVCNHJC6O0CCEOVK5CW1".trim();
    // ------------------------------------------------------------------

    public static String vnp_ApiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

    // Hàm mã hóa dữ liệu
    public static String hmacSHA512(String key, String data) {
        try {
            if (key == null || data == null) throw new NullPointerException();
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception ex) {
            return "";
        }
    }

    // Hàm lấy IP (Đã sửa để fix lỗi IPv6 trên localhost)
    public static String getIpAddress(HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null) {
                ipAdress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAdress = "Invalid IP:" + e.getMessage();
        }

        // Fix cứng cho localhost để VNPAY chấp nhận
        if ("0:0:0:0:0:0:0:1".equals(ipAdress) || "127.0.0.1".equals(ipAdress)) {
            return "127.0.0.1";
        }

        return ipAdress;
    }

    // Hàm tạo mã ngẫu nhiên
    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}