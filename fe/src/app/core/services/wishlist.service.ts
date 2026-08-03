import { Injectable, inject, signal } from '@angular/core'; // Thêm signal
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs'; // Thêm tap
import { WishlistItem } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/wishlist'; 

  // 1. Tạo Signal để lưu số lượng (Mặc định là 0)
  wishlistCount = signal<number>(0);

  // 2. Lấy danh sách & Cập nhật số lượng
  getWishlist(userId: number): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.API_URL}/${userId}`).pipe(
      tap((items) => {
        // Tự động cập nhật số lượng vào Signal khi lấy dữ liệu xong
        this.wishlistCount.set(items.length);
      })
    );
  }

  // 3. Toggle & Tự động tăng/giảm số lượng
  toggleWishlist(userId: number, productId: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/toggle?userId=${userId}&productId=${productId}`, {}).pipe(
      tap((response) => {
        // Backend trả về: { status: true (đã thêm) | false (đã xóa), ... }
        
        this.wishlistCount.update(currentCount => {
            if (response.status === true) {
                return currentCount + 1; // Nếu thêm mới -> Tăng 1
            } else {
                return currentCount > 0 ? currentCount - 1 : 0; // Nếu xóa -> Giảm 1
            }
        });
      })
    );
  }

  // 4. Check trạng thái (Không ảnh hưởng số lượng)
  checkFavorite(userId: number, productId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/check?userId=${userId}&productId=${productId}`);
  }
  
  // 5. Hàm reset (Dùng khi đăng xuất)
  clearWishlist() {
      this.wishlistCount.set(0);
  }
}