import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/products'; // API Backend

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  add(product: any): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product);
  }

  update(id: number, product: any): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, product);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}