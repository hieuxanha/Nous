import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/inventory';

  // Lấy danh sách sản phẩm từ DB
// Lấy danh sách kho (Có phân trang)
  getInventory(page: number, size: number): Observable<any> {
    // API: /api/inventory?page=0&size=5
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  // Cập nhật số lượng (Gọi API PUT)
  updateStock(productId: number, newQuantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, {}, {
        params: { quantity: newQuantity }
    });
  }

  // Lấy lịch sử biến động kho
  getStockHistory(productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${productId}/history`);
  }
}