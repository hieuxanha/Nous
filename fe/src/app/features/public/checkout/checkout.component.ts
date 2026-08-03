import { Component, OnInit, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { VoucherService } from '../../../core/services/voucher.service'; // Import VoucherService

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-white font-sans">
      <div class="container mx-auto max-w-7xl px-4 md:px-8">
        
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 py-10">
          
          <div class="w-full lg:w-3/5 order-2 lg:order-1">
            <div class="mb-6">
              <h1 class="text-3xl font-medium text-[#cc8d8d] mb-2 tracking-wider">nous</h1>
              <nav class="text-sm text-gray-500 flex gap-2">
                <a routerLink="/cart" class="text-blue-500 hover:underline">Giỏ hàng</a>
                <span>&rsaquo;</span>
                <span class="text-gray-900">Thông tin giao hàng</span>
              </nav>
            </div>

            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">Thông tin giao hàng</h2>
              <div class="text-sm">
                <span class="text-gray-500">Bạn đã có tài khoản? </span>
                <a routerLink="/login" class="text-blue-500 hover:underline">Đăng nhập</a>
              </div>
            </div>

            <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
              
              <div class="mb-3">
                <input type="text" formControlName="fullName" placeholder="Họ và tên" class="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:border-[#cc8d8d]" [ngClass]="{'border-red-500': isFieldInvalid('fullName')}">
                <div *ngIf="isFieldInvalid('fullName')" class="text-red-500 text-xs mt-1">Vui lòng nhập họ tên</div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div class="md:col-span-2">
                  <input type="email" formControlName="email" placeholder="Email" class="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:border-[#cc8d8d]">
                </div>
                <div>
                  <input type="tel" formControlName="phone" placeholder="Số điện thoại" class="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:border-[#cc8d8d]" [ngClass]="{'border-red-500': isFieldInvalid('phone')}">
                </div>
              </div>

              <div class="mb-3">
                <input type="text" formControlName="address" placeholder="Địa chỉ (ví dụ: 103 Vạn Phúc, Hà Đông)" class="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:border-[#cc8d8d]">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                
                <div class="relative">
                  <select formControlName="city" (change)="onProvinceChange($event)" class="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:border-[#cc8d8d] appearance-none bg-white text-gray-500" [ngClass]="{'text-black': checkoutForm.get('city')?.value}">
                    <option value="" disabled selected>Chọn Tỉnh / Thành</option>
                    <option *ngFor="let p of provinces" [value]="p.Name">{{ p.Name }}</option>
                  </select>
                  <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs">▼</div>
                </div>

                <div class="relative">
                  <select formControlName="district" (change)="onDistrictChange($event)" class="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:border-[#cc8d8d] appearance-none bg-white text-gray-500" [ngClass]="{'text-black': checkoutForm.get('district')?.value}">
                    <option value="" disabled selected>Chọn Quận / Huyện</option>
                    <option *ngFor="let d of districts" [value]="d.Name">{{ d.Name }}</option>
                  </select>
                  <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs">▼</div>
                </div>

                <div class="relative">
                  <select formControlName="ward" class="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:border-[#cc8d8d] appearance-none bg-white text-gray-500" [ngClass]="{'text-black': checkoutForm.get('ward')?.value}">
                    <option value="" disabled selected>Chọn Phường / Xã</option>
                    <option *ngFor="let w of wards" [value]="w.Name">{{ w.Name }}</option>
                  </select>
                  <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs">▼</div>
                </div>
              </div>

              <div class="mb-8">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Phương thức thanh toán</h2>
                <div class="border border-gray-300 rounded overflow-hidden">
                  <label class="flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" formControlName="paymentMethod" value="COD" class="w-4 h-4 text-[#cc8d8d] focus:ring-[#cc8d8d]">
                    <div class="ml-4 flex-1">
                      <span class="block text-sm font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                    </div>
                    <span class="text-xl">🚚</span>
                  </label>
                  <label class="flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" formControlName="paymentMethod" value="BANKING" class="w-4 h-4 text-[#cc8d8d] focus:ring-[#cc8d8d]">
                    <div class="ml-4 flex-1">
                      <span class="block text-sm font-medium text-gray-900">Chuyển khoản ngân hàng</span>
                    </div>
                    <span class="text-xl">🏦</span>
                  </label>
                  <label class="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" formControlName="paymentMethod" value="VNPAY" class="w-4 h-4 text-[#cc8d8d] focus:ring-[#cc8d8d]">
                    <div class="ml-4 flex-1 flex items-center gap-2">
                      <span class="block text-sm font-medium text-gray-900">Thanh toán qua VNPAY</span>
                      <span class="text-xs text-blue-600 font-semibold border border-blue-600 px-1 rounded">VNPay</span>
                    </div>
                    <span class="text-xl">💳</span>
                  </label>
                </div>
              </div>

              <div class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mt-6">
                <a routerLink="/cart" class="text-blue-500 hover:text-blue-700 hover:underline">Giỏ hàng</a>
                
                <button type="submit" [disabled]="isSubmitting" class="bg-[#cc8d8d] hover:bg-[#b57b7b] text-white px-10
                 py-4 rounded text-sm font-bold uppercase tracking-wide transition-colors w-full md:w-auto shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
                  {{ isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đơn hàng' }}
                </button>
              </div>

            </form>
          </div>

          <div class="w-full lg:w-2/5 order-1 lg:order-2">
            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-4">
              
              <div class="flex flex-col gap-4 border-b border-gray-200 pb-6 max-h-[300px] overflow-y-auto">
                <div *ngFor="let item of cartItems()" class="flex gap-4 items-center">
                  <div class="relative w-16 h-16 border border-gray-200 rounded overflow-hidden bg-white flex-shrink-0">
                    <img [src]="item.image" class="w-full h-full object-cover" onerror="this.src='assets/img/placeholder.png'">
                    <span class="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-10 shadow-sm border border-white">{{ item.quantity }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h3>
                    <p class="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span *ngIf="item.size">Size: {{ item.size }}</span>
                      <span *ngIf="item.size" class="text-gray-300">|</span>
                      <span class="font-semibold text-slate-700">x {{ item.quantity }}</span>
                    </p>
                  </div>
                  <div class="text-sm font-medium text-gray-900">{{ item.price * item.quantity | number:'1.0-0' }}₫</div>
                </div>
              </div>

              <div class="py-6 space-y-3">
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Tạm tính</span>
                  <span>{{ originalTotal | number:'1.0-0' }}₫</span>
                </div>
                
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span class="text-green-600">Miễn phí</span>
                </div>

                <div *ngIf="discountAmount > 0" class="flex justify-between text-sm text-green-600 font-medium animate-fade-in">
                  <span>Giảm giá (Voucher)</span>
                  <span>-{{ discountAmount | number:'1.0-0' }}₫</span>
                </div>
              </div>

              <div class="border-t border-gray-200 py-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Mã giảm giá</label>
                <div class="flex gap-2">
                  <input 
                    [formControl]="voucherControl" 
                    [readonly]="!!appliedVoucherCode"
                    placeholder="Nhập mã (VD: SALE50)" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-red-200 focus:ring-1 focus:ring-red-200 disabled:bg-gray-100 uppercase transition-all">
                  
                  <button 
                    *ngIf="!appliedVoucherCode"
                    (click)="applyVoucher()" 
                    [disabled]="isCheckingVoucher || !voucherControl.value"
                    
                    class="px-4 py-2 bg-[#cc8d8d] text-white text-sm rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
                    {{ isCheckingVoucher ? '...' : 'Áp dụng' }}
                  </button>

                  <button 
                    *ngIf="appliedVoucherCode"
                    (click)="removeVoucher()" 
                    class="px-4 py-2 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200 transition-colors border border-red-200 whitespace-nowrap">
                    Xóa
                  </button>
                </div>

                <p *ngIf="voucherError" class="text-red-500 text-xs mt-2 flex items-center gap-1">
                  {{ voucherError }}
                </p>

                <p *ngIf="appliedVoucherCode" class="text-green-600 text-xs mt-2 flex items-center gap-1">
                  Đã áp dụng mã: <strong>{{ appliedVoucherCode }}</strong>
                </p>
              </div>

              <div class="border-t border-gray-200 pt-6 flex justify-between items-center">
                <span class="text-base font-bold text-gray-800">Tổng cộng</span>
                <div class="text-right">
                  <span class="text-xs text-gray-500 mr-2">VND</span>
                  <span class="text-2xl font-bold text-[#cc8d8d]">{{ finalTotal | number:'1.0-0' }}₫</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  isSubmitting = false;

  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private voucherService = inject(VoucherService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  cartItems = computed(() => this.cartService.cart()?.items || []);
  
  // Biến lưu dữ liệu địa chính
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  // Biến cho Voucher
  voucherControl = new FormControl('');
  isCheckingVoucher = false;
  voucherError = '';
  appliedVoucherCode = '';
  discountAmount = 0;

  constructor() {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      city: ['', Validators.required],    
      district: ['', Validators.required], 
      ward: ['', Validators.required],    
      paymentMethod: ['COD', Validators.required]
    });

    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.checkoutForm.patchValue({
          fullName: user.fullName,
          email: user.email,
phone: (user as any).phone || ''        
});
      }
    });
  }

  ngOnInit(): void {
    // 1. Tải dữ liệu Tỉnh/Thành
    this.http.get<any[]>('assets/data/vietnam-data.json').subscribe(data => {
      this.provinces = data;
    });

    // 2. Load giỏ hàng nếu chưa có
    if (this.authService.isLoggedIn() && this.cartItems().length === 0) {
        this.cartService.getCart().subscribe();
    }
  }

  // --- LOGIC TÍNH TOÁN TIỀN ---
  get originalTotal(): number {
    return this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get finalTotal(): number {
    return Math.max(0, this.originalTotal - this.discountAmount);
  }

  // --- LOGIC VOUCHER ---
applyVoucher() {
    const code = this.voucherControl.value?.trim();
    if (!code) return;

    this.isCheckingVoucher = true;
    this.voucherError = '';

    this.voucherService.checkVoucher(code, this.originalTotal).subscribe({
      next: (res) => {
        // [SỬA ĐỔI] Backend giờ trả về { discountAmount: ... }
        this.discountAmount = res.discountAmount; 
        
        this.appliedVoucherCode = code;
        this.isCheckingVoucher = false;
        this.voucherControl.disable();
      },
      error: (err) => {
        this.isCheckingVoucher = false;
        
        // [SỬA ĐỔI] Lấy thông báo lỗi từ JSON { message: "..." }
        // Nếu backend trả về JSON chuẩn, lỗi sẽ nằm trong err.error.message
        this.voucherError = err.error?.message || 'Mã không hợp lệ hoặc không đủ điều kiện!';
        
        this.discountAmount = 0;
        this.appliedVoucherCode = '';
      }
    });
  }

  removeVoucher() {
    this.appliedVoucherCode = '';
    this.discountAmount = 0;
    this.voucherControl.enable();
    this.voucherControl.setValue('');
    this.voucherError = '';
  }

  // --- LOGIC CHỌN ĐỊA CHỈ ---
  onProvinceChange(event: any) {
    const provinceName = event.target.value;
    const selectedProvince = this.provinces.find(p => p.Name === provinceName);
    
    if (selectedProvince) {
      this.districts = selectedProvince.Districts;
      this.wards = [];
      this.checkoutForm.patchValue({ district: '', ward: '' });
    }
  }

  onDistrictChange(event: any) {
    const districtName = event.target.value;
    const selectedDistrict = this.districts.find(d => d.Name === districtName);

    if (selectedDistrict) {
      this.wards = selectedDistrict.Wards;
      this.checkoutForm.patchValue({ ward: '' });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // --- SUBMIT ---
  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    // Gộp dữ liệu Form + Voucher Code
    const requestData = {
      ...this.checkoutForm.value,
      voucherCode: this.appliedVoucherCode
    };

    this.orderService.placeOrder(requestData).subscribe({
      next: (res: any) => {
        // Xóa giỏ hàng
        this.cartService.cart.set(null);
        this.cartService.getCart().subscribe();

        // Điều hướng
        if (requestData.paymentMethod === 'VNPAY' && res.paymentUrl) {
          window.location.href = res.paymentUrl;
        } else {
          this.router.navigate(['/checkout/success'], {
            queryParams: { id: res.id }
          });
        }
      },
      error: (err) => {
        console.error('Lỗi đặt hàng:', err);
        const errorMessage = err.error?.message || err.error || 'Vui lòng thử lại';
        alert('❌ Có lỗi xảy ra: ' + errorMessage);
        this.isSubmitting = false;
      }
    });
  }
}