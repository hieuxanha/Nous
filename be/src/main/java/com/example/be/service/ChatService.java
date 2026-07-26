package com.example.be.service;

import com.example.be.dto.ChatResponse;
import com.example.be.entity.Product;
import com.example.be.repository.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ProductRepository productRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Key lấy từ ảnh của bạn (nhớ xóa sau khi xong đồ án)
    private final String API_KEY = "AIzaSyAVvNXByWrApsN0ZDYagpap18YhOQ1r61k";

    // [QUAN TRỌNG] Đổi sang model 2.5 như trong ảnh bạn chụp
    private final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public ChatResponse processMessage(String userMessage) {
        try {
            List<Product> products = productRepository.findAll();
            // Giới hạn 30 sản phẩm
            String productContext = products.stream()
                    .limit(30)
                    .map(p -> String.format("- %s (Giá: %s VNĐ, Kho: %d)",
                            p.getName(), p.getPrice(), p.getQuantity()))
                    .collect(Collectors.joining("\n"));

            String systemPrompt = String.format("""
                Bạn là nhân viên tư vấn của Shop.
                Dữ liệu sản phẩm:
                %s
                
                Khách hỏi: "%s"
                Trả lời ngắn gọn, thân thiện bằng tiếng Việt.
                """, productContext, userMessage);

            return new ChatResponse(callGeminiApi(systemPrompt), "TEXT", null);

        } catch (Exception e) {
            e.printStackTrace();
            return new ChatResponse("Hệ thống đang bận.", "TEXT", null);
        }
    }

    private String callGeminiApi(String prompt) {
        try {
            String finalUrl = API_URL + "?key=" + API_KEY;
            System.out.println(" Đang gọi model 2.5: " + finalUrl);

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", Collections.singletonList(textPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(parts));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(finalUrl, entity, String.class);

            JsonNode rootNode = objectMapper.readTree(response.getBody());
            if (rootNode.has("candidates") && !rootNode.path("candidates").isEmpty()) {
                return rootNode.path("candidates").get(0)
                        .path("content").path("parts").get(0)
                        .path("text").asText();
            }
            return "Tôi không hiểu ý bạn.";

        } catch (HttpClientErrorException e) {
            System.err.println(" Lỗi Google API: " + e.getResponseBodyAsString());
            return "Lỗi API: " + e.getStatusCode();
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi hệ thống.";
        }
    }
}