import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, ReviewRequest } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  
  // Đường dẫn API (Sửa port nếu backend của bạn khác 8080)
  private readonly API_URL = 'http://localhost:8080/api/reviews';

  // 1. Lấy danh sách đánh giá theo Product ID
  // GET: /api/reviews/product/{productId}
  getReviewsByProduct(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API_URL}/product/${productId}`);
  }

  // 2. Thêm đánh giá mới
  // POST: /api/reviews
  addReview(data: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.API_URL}`, data);
  }

  // 3. Lấy TẤT CẢ đánh giá
  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API_URL}`);
  }

  // 4. Xóa đánh giá (theo ID)
  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
  // 5. Ẩn/Hiện đánh giá (Admin)
toggleReviewVisibility(id: number): Observable<any> {
  return this.http.put(`${this.API_URL}/${id}/toggle`, {});
}
}