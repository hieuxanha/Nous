package com.example.be.service;

import com.example.be.config.VnPayConfig;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class PaymentService {

    public String createVnPayPayment(HttpServletRequest request, long amount, String orderInfo) throws UnsupportedEncodingException {
        // 1. DÙNG CẤU HÌNH TEST CÔNG CỘNG (Luôn hoạt động)
        String vnp_TmnCode = "Z6JKT5A2";
        String vnp_HashSecret = "59T7877BRAH5T9H72HD6O12J9W7TDSR3";
        String vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = VnPayConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";
        String orderType = "other";

        // Số tiền * 100
        amount = amount * 100;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (vnp_TxnRef != null) vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        if (orderInfo != null) vnp_Params.put("vnp_OrderInfo", orderInfo);
        if (orderType != null) vnp_Params.put("vnp_OrderType", orderType);

        vnp_Params.put("vnp_Locale", "vn");
        // URL trả về (Frontend)
        vnp_Params.put("vnp_ReturnUrl", "http://localhost:4200/checkout/success");
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Build URL & Hash
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build Hash Data
                hashData.append(fieldName);
                hashData.append('=');
                // Quan trọng: Dữ liệu hash có thể cần hoặc không cần encode tùy phiên bản,
                // nhưng với bộ test public này, ta encode cả trong hash để an toàn
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                // Build Query URL
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayConfig.hmacSHA512(vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        return vnp_Url + "?" + queryUrl;
    }
}