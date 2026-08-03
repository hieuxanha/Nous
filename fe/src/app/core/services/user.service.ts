import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'http://localhost:8080/api/users';
  private authApi = 'http://localhost:8080/auth';

  currentUser = signal<User | null>(null);

  constructor() {
    this.loadFromStorage();
  }

  // --- 1. LOGIC AUTH ---
  private loadFromStorage() {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.updateLocalUser(parsed); // Tái sử dụng logic map
      } catch (e) {
        this.logout();
      }
    }
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.authApi}/login`, data).pipe(
        tap((res) => {
            const raw = res.user || res; 
            const userToSave: User = {
                id: raw.id || raw.userId,
                email: raw.email,
                token: res.token || raw.token,
                role: raw.role,
                fullName: raw.fullName || raw.full_name || raw.name || "User",
                phone: raw.phone || raw.phone_number || raw.phoneNumber || "",
                gender: raw.gender || "male",
            };
            this.updateLocalUser(userToSave);
        })
    );
  }

  private updateLocalUser(user: User) {
    // Map lại lần nữa để chắc chắn fields
    const cleanUser: User = {
        ...user,
        id: user.id || (user as any).userId,
        fullName: user.fullName || (user as any).full_name || '',
        phone: user.phone || (user as any).phone_number || (user as any).phoneNumber || '',
        gender: user.gender || 'male'
    };
    
    this.currentUser.set(cleanUser);
    localStorage.setItem('user', JSON.stringify(cleanUser));
    if (user.token) localStorage.setItem('token', user.token);
  }

  logout() {
    this.currentUser.set(null);
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // --- 2. LOGIC PROFILE USER ---
  
  // [MỚI] Lấy user theo ID (Gọi API Backend mới thêm)
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateProfile(formData: any): Observable<any> {
    const user = this.currentUser();
    if (!user || !user.id) throw new Error("Chưa đăng nhập");

    const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address || ''
    };

    return this.http.put<any>(`${this.apiUrl}/${user.id}`, payload).pipe(
        tap(() => {
            // Cập nhật LocalStorage ngay lập tức
            const updatedUser = {
                ...user,
                fullName: formData.fullName,
                phone: formData.phone,
                gender: formData.gender,
            };
            this.updateLocalUser(updatedUser);
        })
    );
  }

  // --- 3. LOGIC ADMIN ---
  getUsers(): Observable<any[]> { return this.http.get<any[]>(this.apiUrl); }
  deleteUser(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
  updateRole(userId: number, roleName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/role`, {}, { params: { roleName: roleName } });
  }
}