package com.example.be.service;

import com.example.be.dto.ProductDTO;
import com.example.be.dto.ProductResponse;
import com.example.be.entity.Product;
import java.util.List;

public interface ProductService {
//    List<Product> getAllProducts();
List<ProductResponse> getAllProducts();
//    Product getProductById(Long id);
ProductResponse getProductById(Long id);
    Product createProduct(ProductDTO productDTO);
    Product updateProduct(Long id, ProductDTO productDTO);
    void deleteProduct(Long id);
}