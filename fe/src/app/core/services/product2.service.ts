// src/app/core/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product2.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Thay đổi đường dẫn này trỏ về Backend của bạn (VD: Spring Boot chạy cổng 8080)
  private apiUrl = 'http://localhost:8080/products'; 

  constructor(private http: HttpClient) {}

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

// Lấy sản phẩm theo danh mục
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    // Gọi vào: http://localhost:8080/products/category/{id}
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

// Nếu muốn lấy tên danh mục để hiển thị tiêu đề
getCategoryDetail(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories/${categoryId}`);
}

// Hàm tìm kiếm gợi ý
searchProducts(keyword: string): Observable<any[]> {
  // Gọi API: GET http://localhost:8080/api/products/search?keyword=abc
  return this.http.get<any[]>(`${this.apiUrl}/search?keyword=${keyword}`);
}
}