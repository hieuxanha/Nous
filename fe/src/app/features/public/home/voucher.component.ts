import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoucherService } from '../../../core/services/voucher.service'; // Import Service vừa tạo

@Component({
  selector: 'app-voucher-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="voucher-list-container">
      
      <div *ngIf="isLoading" class="loading-text">
        Đang tải ưu đãi...
      </div>

      <div *ngIf="!isLoading && vouchers.length === 0" class="loading-text">
        Hiện chưa có mã giảm giá nào.
      </div>

      <div class="voucher-card" *ngFor="let item of vouchers">
        
        <div class="card-top">
          <div class="header-row">
            <span class="code-badge">MÃ: {{ item.code }}</span>
          </div>
          
          <div class="value-content">
            <div class="discount-label">Giảm</div>
            <div class="discount-value">{{ item.displayValue }}</div>
          </div>

          <div class="dashed-line"></div>
          <div class="notch notch-left"></div>
          <div class="notch notch-right"></div>
        </div>

        <div class="card-bottom">
          <p class="desc">
            Giảm <b>{{ item.displayDiscountAmount }}</b> cho đơn tối thiểu {{ item.displayMinOrder }}
          </p>
          
          <div class="action-row">
            <a href="javascript:void(0)" class="link-term">HSD: {{ item.endDate | date:'dd/MM/yyyy' }}</a>
            <button class="btn-copy" (click)="copyToClipboard(item.code)">
              <span>Sao chép</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* --- TỔNG THỂ --- */
    .voucher-list-container {
      display: flex; flex-wrap: wrap; gap: 25px;
      justify-content: center; padding: 30px 10px;
      font-family: 'Inter', system-ui, sans-serif;
    }

    .loading-text {
      width: 100%; text-align: center; color: #888; margin-top: 20px;
    }

    .voucher-card {
      width: 290px; display: flex; flex-direction: column;
      position: relative; background: transparent;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: default;
    }

    .voucher-card:hover {
      transform: translateY(-6px);
      filter: drop-shadow(0 15px 30px rgba(197, 160, 117, 0.25));
    }

    /* --- PHẦN TRÊN --- */
    .card-top {
      background-color: #ffffff; padding: 20px 20px 35px 20px;
      border-radius: 16px 16px 0 0; position: relative;
      border: 1px solid #eee; border-bottom: none; 
      display: flex; flex-direction: column; align-items: center;
    }

    .header-row { width: 100%; text-align: left; margin-bottom: 10px; }
    
    .code-badge {
      font-size: 12px; font-weight: 700; color: #D49E8D;
      background: #FFF5F2; padding: 4px 8px; border-radius: 4px; letter-spacing: 0.5px;
    }

    .value-content {
      border: 1px solid #f0f0f0; border-radius: 12px;
      width: 100%; height: 110px; display: flex;
      align-items: center; justify-content: center; gap: 8px; background: #fff;
    }

    .discount-label {
      font-size: 16px; font-weight: 600; color: #A08B7D;
      text-transform: uppercase; margin-top: 10px;
    }

    .discount-value {
      font-size: 64px; font-weight: 800; color: #C5A075;
      line-height: 1; letter-spacing: -3px;
    }

    /* --- VẾT LÕM & ĐƯỜNG KẺ --- */
    .notch {
      position: absolute; bottom: -12px; width: 24px; height: 24px;
      background-color: #FAFAFA; border-radius: 50%; z-index: 10;
      box-shadow: inset 0 0 0 1px #eee; 
    }
    .notch-left { left: -12px; clip-path: inset(0 0 0 50%); }
    .notch-right { right: -12px; clip-path: inset(0 50% 0 0); }

    .dashed-line {
      position: absolute; bottom: 0; left: 12px; right: 12px;
      height: 1px; border-bottom: 2px dashed #e0e0e0;
    }

    /* --- PHẦN DƯỚI --- */
    .card-bottom {
      background-color: #FDFBF9; padding: 20px; padding-top: 25px;
      border-radius: 0 0 16px 16px; border: 1px solid #eee; border-top: none;
      display: flex; flex-direction: column; gap: 15px;
    }

    .desc { font-size: 13px; color: #666; margin: 0; text-align: center; line-height: 1.5; }
    .desc b { color: #333; }

    .action-row { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }

    .link-term { font-size: 12px; color: #999; text-decoration: none; transition: color 0.2s; }
    .link-term:hover { color: #D49E8D; }

    .btn-copy {
      background: #C5A075; color: white; border: none; padding: 8px 20px;
      border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer;
      box-shadow: 0 4px 10px rgba(197, 160, 117, 0.4); transition: all 0.2s;
    }
    .btn-copy:hover { transform: translateY(-1px); background: #b08d65; }
  `]
})
export class VoucherListComponent implements OnInit {
  private voucherService = inject(VoucherService);
  
  vouchers: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.fetchVouchers();
  }

  fetchVouchers() {
    this.voucherService.getAllVouchers().subscribe({
      next: (data) => {
        // Backend trả về mảng object, ta cần map lại để có các trường hiển thị đẹp
        this.vouchers = data
          .filter(v => v.isActive) // Chỉ lấy voucher đang hoạt động
          .map(v => ({
            ...v,
            // 1. Tạo số to (VD: 10000 -> 10K, 20 -> 20%)
            displayValue: this.formatBigValue(v),     
            // 2. Tạo mô tả số tiền giảm (VD: 10,000đ)
            displayDiscountAmount: this.formatCurrency(v.discountValue, v.discountType), 
            // 3. Tạo mô tả đơn tối thiểu (VD: 299K)
            displayMinOrder: this.formatSimpleCurrency(v.minOrderValue) 
          }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi call API voucher:', err);
        this.isLoading = false;
      }
    });
  }

  // HÀM XỬ LÝ FORMAT DỮ LIỆU
  
  // Format số to ở giữa thẻ (10K, 20%)
  formatBigValue(voucher: any): string {
    if (voucher.discountType === 'PERCENT') {
      return Math.round(voucher.discountValue) + '%';
    } else {
      // Nếu là số tiền cố định (FIXED), chia cho 1000 và thêm K
      if (voucher.discountValue >= 1000) {
        return Math.floor(voucher.discountValue / 1000).toString() + 'K';
      }
      return voucher.discountValue.toString();
    }
  }

  // Format số tiền chi tiết (10.000đ)
  formatCurrency(value: number, type: string): string {
    if (type === 'PERCENT') {
      return Math.round(value) + '%'; // Nếu giảm % thì hiển thị %
    }
    // Nếu giảm tiền thì format tiền Việt
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }

  // Format đơn tối thiểu cho gọn (299K thay vì 299.000đ)
  formatSimpleCurrency(value: number): string {
    if (!value) return '0đ';
    if (value >= 1000000) {
      return (value / 1000000) + 'Tr'; // 1.200.000 -> 1.2Tr
    }
    if (value >= 1000) {
      return Math.floor(value / 1000) + 'K'; // 299.000 -> 299K
    }
    return value.toString();
  }

  copyToClipboard(code: string) {
    navigator.clipboard.writeText(code).then(() => alert(`Đã sao chép mã: ${code}`));
  }
}