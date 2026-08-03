import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define interfaces to match Backend DTOs
export interface StatsResponse {
  kpis: KpiDTO[];
  revenueChart: RevenueChartDTO[];
  categoryStats: CategoryStatDTO[];
  topProducts: TopProductDTO[];
}

export interface KpiDTO {
  label: string;
  value: string;
  percent: number;
  isIncrease: boolean;
  type: string;
}

export interface RevenueChartDTO {
  label: string;
  percent: number;
  fullValue: string;
}

export interface CategoryStatDTO {
  name: string;
  percent: number;
  value: string;
}

export interface TopProductDTO {
  name: string;
  sku: string;
  image: string;
  sold: number;
  stock: number;
  revenue: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/admin/stats';

  getStats(filter: string): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.apiUrl}?filter=${filter}`);
  }
}