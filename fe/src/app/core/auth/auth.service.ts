import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CartService } from '../services/cart.service';

export interface User {
  id?: number;
  email: string;
  fullName: string;
  token?: string;
  role?: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private cartService = inject(CartService); 
  private API_URL = 'http://localhost:8080/auth'; 

  currentUser = signal<User | null>(null);

  constructor() {
    this.loadUserFromStorage();
  }

  // --- 1. HÀM LOAD DỮ LIỆU KHI F5 (Đã sửa lỗi) ---
  private loadUserFromStorage() {
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      try {
        // Log xem thực tế trong storage đang lưu chuỗi gì
        console.log(' [F5] Raw JSON trong Storage:', savedUser);

        const parsedUser = JSON.parse(savedUser);

        const restoredUser: User = {
            // [SỬA LỖI]: Bắt cả id và userId
            id: parsedUser.id || parsedUser.userId, 
            
            email: parsedUser.email,
            
            // Map tên
            fullName: parsedUser.fullName || parsedUser.full_name || parsedUser.name || "User",
            
            // Map Role
            role: parsedUser.role || (parsedUser.roles ? parsedUser.roles[0] : ''),
            
            // [QUAN TRỌNG] Map Token
            token: parsedUser.token
        };

        // Kiểm tra xem ID và Token có lấy được không
        if (!restoredUser.id || !restoredUser.token) {
            console.error(' [F5] Dữ liệu trong Storage bị thiếu ID hoặc Token!');
            // Không logout ngay để bạn còn debug, nhưng đúng ra là sẽ lỗi
        } else {
            console.log(' [F5] Khôi phục User thành công:', restoredUser);
        }

        this.currentUser.set(restoredUser);

        // Load giỏ hàng
        if (restoredUser.token) {
             this.cartService.getCart().subscribe({
                error: () => console.log(' Không tải được giỏ hàng (Token hết hạn hoặc lỗi mạng)')
             });
        }

      } catch (e) {
        console.error('Lỗi parse JSON user:', e);
        this.logout();
      }
    }
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  // --- 2. HÀM LOGIN (Đã sửa lỗi) ---
  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, data).pipe(
      tap((response) => {
        // Tìm object chứa thông tin user (đề phòng backend trả về lồng nhau)
        const rawUser = response.user || response.data || response;
        
        // Tìm ID ở mọi nơi có thể (cả trong rawUser lẫn response gốc)
        const realId = rawUser.id || rawUser.userId || response.userId || response.id;
        
        // Tìm Token ở mọi nơi có thể
        const realToken = response.token || rawUser.token;

        console.log(' [Login] ID tìm được:', realId);
        console.log('[Login] Token tìm được:', realToken);

        const userToSave: User = {
            id: realId,
            email: rawUser.email,
            fullName: rawUser.full_name || rawUser.fullName || rawUser.name || "User", 
            role: rawUser.role || (rawUser.roles ? rawUser.roles[0] : ''),
            token: realToken
        };

        this.currentUser.set(userToSave);
        
        // Log xem mình sắp lưu cái gì vào Storage
        console.log(' [Login] Đang lưu vào Storage:', userToSave);

        // Lưu User object vào storage
        localStorage.setItem('user', JSON.stringify(userToSave));
        
        // Lưu riêng token nếu cần cho Interceptor
        if (realToken) {
            localStorage.setItem('token', realToken);
        }
        
        this.cartService.getCart().subscribe();
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.clear(); // Xóa sạch để tránh lỗi dữ liệu cũ
    this.cartService.cart.set(null);
    window.location.href = '/login'; 
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}