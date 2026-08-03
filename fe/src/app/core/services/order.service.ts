import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/orders'; 

  // 1. Đặt hàng
  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, orderData);
  }

  // 2. Lấy chi tiết đơn hàng
  getOrderById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 3. Lấy tất cả (Admin) - PHÂN TRANG
  getAllOrders(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`); 
  }

  // 4. Lấy đơn hàng của tôi - PHÂN TRANG
  getMyOrders(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-orders?page=${page}&size=${size}`);
  }

  // 5. Cập nhật trạng thái
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/status`, {}, {
      params: { status: status }
    });
  }

  // 6. Hủy đơn
  cancelOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  // 7. Xóa đơn
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}