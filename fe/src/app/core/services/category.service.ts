import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);

  // URL API chuẩn: KHÔNG có dấu / ở cuối
  private API_URL = 'http://localhost:8080/categories'; 

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.API_URL);
  }

  add(category: Category): Observable<Category> {
    return this.http.post<Category>(this.API_URL, category);
  }

  update(id: number, category: Category): Observable<Category> {
    // Thêm dấu / thủ công trước id
    return this.http.put<Category>(`${this.API_URL}/${id}`, category); 
  }

  delete(id: number): Observable<void> {
    // Thêm dấu / thủ công trước id
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}