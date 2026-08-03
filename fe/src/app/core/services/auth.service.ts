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

  private loadUserFromStorage() {
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('📢 Dữ liệu User lấy từ LocalStorage:', parsedUser);

        const restoredUser: User = {
            // [SỬA LỖI QUAN TRỌNG]: Kiểm tra cả 'id' và 'userId' khi load lại
            id: parsedUser.id || parsedUser.userId, 
            
            email: parsedUser.email,
            
            // Logic lấy tên
            fullName: parsedUser.fullName || parsedUser.full_name || parsedUser.name || "User",
            
            role: parsedUser.role,
            token: parsedUser.token
        };

        console.log('✅ User sau khi khôi phục (Check ID ở đây):', restoredUser);

        this.currentUser.set(restoredUser);

        // Gọi API lấy giỏ hàng nếu có user
        if (restoredUser.token) {
             this.cartService.getCart().subscribe({
                error: () => console.log('Không tải được giỏ hàng (Token có thể hết hạn)')
             });
        }

      } catch (e) {
        this.logout();
      }
    }
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, data).pipe(
      tap((response) => {
        // Lấy object user từ response
        const rawUser = response.user || response.data || response;
        
        console.log('🔥 API Login trả về:', rawUser); 
        // Trong ảnh của bạn API trả về: userId: 2, roles: ['ROLE_USER']

        const userToSave: User = {
            // [SỬA LỖI]: Map chuẩn xác userId từ API sang id của Frontend
            id: rawUser.id || rawUser.userId || rawUser.user_id, 
            
            email: rawUser.email,
            
            // Map tên
            fullName: rawUser.full_name || rawUser.fullName || rawUser.name || "User", 
            
            // Map Role (API của bạn trả về mảng roles: ['ROLE_USER'])
            role: rawUser.role || (rawUser.roles && rawUser.roles.length > 0 ? rawUser.roles[0] : ''),
            
            token: response.token || rawUser.token
        };

        this.currentUser.set(userToSave);
        
        // Lưu object đã được chuẩn hóa vào LocalStorage
        localStorage.setItem('user', JSON.stringify(userToSave));
        
        if (userToSave.token) {
            localStorage.setItem('token', userToSave.token);
        }
        
        this.cartService.getCart().subscribe();
      })
    );
  }

  // ... Các hàm khác giữ nguyên
  register(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.cartService.cart.set(null);
    window.location.href = '/login'; 
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}