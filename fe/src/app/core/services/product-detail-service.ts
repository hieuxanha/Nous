import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Nếu bạn chưa tách file model, hãy tạm comment dòng này và dùng any
import { Product } from '../models/product.model'; 

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly BASE_URL = 'http://localhost:8080'; 

  // SỬA LẠI: Dùng constructor để khai báo HttpClient (Cách chuẩn)
  constructor(private http: HttpClient) { }

  // 1. Lấy chi tiết sản phẩm
  // Tôi để <any> để tránh báo lỗi nếu bạn chưa có file Product model
  getProductById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/products/${id}`);
  }

  // 2. Thêm vào giỏ hàng
  addToCart(item: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/api/cart/add`, item);
  }
  
}