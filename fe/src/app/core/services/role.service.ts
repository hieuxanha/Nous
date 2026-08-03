import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private http = inject(HttpClient);
  // private apiUrl = 'http://localhost:8080/api/roles'; // API thật

  // Dữ liệu giả lập (Mock data) để hiển thị trước khi có API
  getRoles(): Observable<any[]> {
    // return this.http.get<any[]>(this.apiUrl); // Dùng dòng này khi có Backend
    return of([
        { id: 1, name: 'ROLE_ADMIN', description: 'Quản trị viên hệ thống', userCount: 2 },
        { id: 2, name: 'ROLE_USER', description: 'Khách hàng mua sắm', userCount: 156 },
        { id: 3, name: 'ROLE_STAFF', description: 'Nhân viên bán hàng', userCount: 5 }
    ]);
  }
}