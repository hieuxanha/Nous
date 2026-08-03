import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/vouchers';

  // 1. Lấy tất cả voucher (Admin)
  getAllVouchers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/all`);
  }

  // 2. Tạo voucher mới (Admin)
  createVoucher(voucherData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/create`, voucherData);
  }

  // 3. Xóa voucher
  deleteVoucher(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/admin/${id}`, { responseType: 'text' });
  }

  updateVoucher(id:number, voucherData:any):Observable<any>{
return this.http.put(`${this.API_URL}/admin/${id}`, voucherData);
  }

  // 4. User check (Cũ)
// checkVoucher trả về Object any thay vì number
  checkVoucher(code: string, totalAmount: number): Observable<any> {
    const params = new HttpParams()
      .set('code', code)
      .set('totalAmount', totalAmount.toString());
      
    // Backend trả về JSON nên không cần responseType: 'text'
    return this.http.get<any>(`${this.API_URL}/check`, { params });
  }
}