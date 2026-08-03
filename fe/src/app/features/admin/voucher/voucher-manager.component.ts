import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VoucherService } from '../../../core/services/voucher.service'; // Đảm bảo đường dẫn đúng

@Component({
  selector: 'app-voucher-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Không cần DatePipe ở đây nếu chỉ dùng trong template
  providers: [DatePipe, DecimalPipe],
  template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Quản lý Mã Giảm Giá</h1>
          <p class="text-sm text-gray-500 mt-1">Tạo và quản lý các chương trình khuyến mãi</p>
        </div>
        <button (click)="toggleForm()" 
                class="transition-all duration-300 px-5 py-2.5 rounded-lg shadow-lg font-medium flex items-center gap-2"
                [ngClass]="showForm ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-[#cc8d8d] hover:bg-[#b57b7b] text-white'">
          <span *ngIf="!showForm">+ Tạo Voucher Mới</span>
          <span *ngIf="showForm">Đóng / Hủy bỏ</span>
        </button>
      </div>

      <div *ngIf="showForm" class="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100 animate-fade-in-down">
        
        <div class="flex justify-between items-center mb-4 border-b pb-2">
          <h2 class="text-lg font-semibold text-gray-700">
            {{ isEditing ? 'Cập nhật Voucher' : 'Thông tin Voucher Mới' }}
          </h2>
          <span *ngIf="isEditing" class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Đang chỉnh sửa ID: {{ currentEditId }}</span>
        </div>

        <form [formGroup]="voucherForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mã Voucher (Code) <span class="text-red-500">*</span></label>
                <input formControlName="code" 
                       [readonly]="isEditing" 
                       [class.bg-gray-100]="isEditing"
                       type="text" placeholder="VD: SALE50" 
                       class="w-full border rounded-lg p-2.5 uppercase focus:ring-2 focus:ring-[#cc8d8d] focus:border-[#cc8d8d] outline-none transition">
                <p *ngIf="isInvalid('code')" class="text-red-500 text-xs mt-1">Mã code là bắt buộc</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                <select formControlName="discountType" class="w-full border rounded-lg p-2.5 bg-white">
                  <option value="PERCENT">Theo phần trăm (%)</option>
                  <option value="FIXED">Số tiền cố định (VND)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Giá trị giảm <span class="text-red-500">*</span></label>
                <div class="relative">
                  <input formControlName="discountValue" type="number" class="w-full border rounded-lg p-2.5">
                  <span class="absolute right-3 top-2.5 text-gray-400">
                    {{ voucherForm.get('discountType')?.value === 'PERCENT' ? '%' : 'đ' }}
                  </span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng giới hạn</label>
                <input formControlName="usageLimit" type="number" class="w-full border rounded-lg p-2.5">
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Đơn hàng tối thiểu</label>
                <input formControlName="minOrderValue" type="number" class="w-full border rounded-lg p-2.5">
              </div>

              <div *ngIf="voucherForm.get('discountType')?.value === 'PERCENT'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Giảm tối đa (VND)</label>
                <input formControlName="maxDiscountAmount" type="number" class="w-full border rounded-lg p-2.5" placeholder="Không giới hạn">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu <span class="text-red-500">*</span></label>
                <input formControlName="startDate" type="datetime-local" class="w-full border rounded-lg p-2.5">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc <span class="text-red-500">*</span></label>
                <input formControlName="endDate" type="datetime-local" class="w-full border rounded-lg p-2.5">
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-3 border-t pt-4">
             <button type="button" (click)="toggleForm()" class="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition">
                Hủy bỏ
             </button>
            
            <button type="submit" 
                    [disabled]="isSubmitting || voucherForm.invalid" 
                    class="bg-[#cc8d8d] hover:bg-[#b57b7b] text-white px-8 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="isSubmitting" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Đang xử lý...
              </span>
              <span *ngIf="!isSubmitting">{{ isEditing ? 'Lưu Cập Nhật' : 'Tạo Voucher' }}</span>
            </button>
          </div>
        </form>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th class="p-4 border-b">Mã Code</th>
                <th class="p-4 border-b">Chi tiết giảm</th>
                <th class="p-4 border-b">Điều kiện & Giới hạn</th>
                <th class="p-4 border-b">Thời gian hiệu lực</th>
                <th class="p-4 border-b">Tiến độ</th>
                <th class="p-4 border-b text-center">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm">
              <tr *ngFor="let v of vouchers" class="hover:bg-gray-50 transition">
                
                <td class="p-4">
                  <div class="font-bold text-[#cc8d8d] text-base">{{ v.code }}</div>
                </td>
                
                <td class="p-4">
                  <span *ngIf="v.discountType === 'PERCENT'" class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-200">
                    Giảm {{ v.discountValue }}%
                  </span>
                  <span *ngIf="v.discountType === 'FIXED'" class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-200">
                    Giảm {{ v.discountValue | number:'1.0-0' }}đ
                  </span>
                </td>

                <td class="p-4 text-gray-600">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs">Min đơn: <span class="font-medium text-gray-800">{{ v.minOrderValue | number:'1.0-0' }}đ</span></span>
                    <span *ngIf="v.maxDiscountAmount" class="text-xs text-gray-500">Max giảm: {{ v.maxDiscountAmount | number:'1.0-0' }}đ</span>
                  </div>
                </td>

                <td class="p-4 text-gray-600">
                  <div class="flex flex-col gap-1 text-xs">
                    <div>Bắt đầu: {{ v.startDate | date:'dd/MM/yyyy HH:mm' }}</div>
                    <div [class.text-red-500]="isExpired(v.endDate)">Kết thúc: {{ v.endDate | date:'dd/MM/yyyy HH:mm' }}</div>
                  </div>
                </td>

                <td class="p-4">
                  <div class="w-32">
                    <div class="flex justify-between text-xs mb-1">
                      <span>Đã dùng</span>
                      <span class="font-medium">{{ v.usedCount }}/{{ v.usageLimit }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-[#cc8d8d] h-2 rounded-full transition-all duration-500" 
                           [style.width.%]="(v.usedCount / v.usageLimit) * 100"></div>
                    </div>
                  </div>
                </td>

                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button (click)="startEdit(v)" class="text-blue-500 hover:bg-blue-100 p-2 rounded-full transition" title="Sửa">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button (click)="deleteVoucher(v.id)" class="text-red-500 hover:bg-red-100 p-2 rounded-full transition" title="Xóa">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr *ngIf="vouchers.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
                   <p>Chưa có mã giảm giá nào.</p>
                   <button (click)="toggleForm()" class="text-[#cc8d8d] hover:underline mt-2">Tạo ngay</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-down { animation: fadeInDown 0.3s ease-out; }
    
    /* Custom scrollbar nếu cần */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  `]
})
export class VoucherManagerComponent implements OnInit {
  private voucherService = inject(VoucherService);
  private fb = inject(FormBuilder);

  vouchers: any[] = [];
  showForm = false;
  isSubmitting = false;
  
  // Trạng thái edit
  isEditing = false;
  currentEditId: number | null = null;
  
  voucherForm: FormGroup;

  constructor() {
    this.voucherForm = this.fb.group({
      code: ['', Validators.required],
      discountType: ['PERCENT', Validators.required],
      discountValue: [0, [Validators.required, Validators.min(1)]],
      minOrderValue: [0, Validators.required],
      maxDiscountAmount: [null],
      usageLimit: [100, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadVouchers();
  }

  loadVouchers() {
    this.voucherService.getAllVouchers().subscribe({
      next: (res) => this.vouchers = res,
      error: (err) => console.error('Lỗi load voucher:', err)
    });
  }

  // Helper kiểm tra hết hạn (để bôi đỏ ngày kết thúc)
  isExpired(endDate: string): boolean {
    return new Date(endDate) < new Date();
  }

  toggleForm() {
    if (this.showForm) {
      this.resetFormState();
      this.showForm = false;
    } else {
      this.resetFormState();
      this.showForm = true;
    }
  }

  startEdit(voucher: any) {
    this.isEditing = true;
    this.currentEditId = voucher.id;
    this.showForm = true;

    // QUAN TRỌNG: Format ngày để input datetime-local hiểu (yyyy-MM-ddTHH:mm)
    const startDateFormatted = this.formatDateForInput(voucher.startDate);
    const endDateFormatted = this.formatDateForInput(voucher.endDate);

    this.voucherForm.patchValue({
      code: voucher.code,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      minOrderValue: voucher.minOrderValue,
      maxDiscountAmount: voucher.maxDiscountAmount,
      usageLimit: voucher.usageLimit,
      startDate: startDateFormatted,
      endDate: endDateFormatted
    });
    
    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Hàm format ngày an toàn
  private formatDateForInput(dateString: any): string {
    if (!dateString) return '';
    // Nếu backend trả về mảng [2024, 12, 25, 10, 30] -> cần xử lý riêng (Spring Boot mặc định trả ISO String thì dùng logic dưới)
    // Cắt chuỗi ISO để lấy yyyy-MM-ddTHH:mm (bỏ giây và múi giờ nếu có)
    return dateString.toString().substring(0, 16);
  }

  onSubmit() {
    if (this.voucherForm.invalid) {
      this.voucherForm.markAllAsTouched(); // Hiển thị lỗi đỏ các ô chưa nhập
      return;
    }

    // Logic validate ngày bắt đầu < ngày kết thúc (tuỳ chọn thêm)
    const start = new Date(this.voucherForm.value.startDate);
    const end = new Date(this.voucherForm.value.endDate);
    if (start >= end) {
      alert('Ngày kết thúc phải lớn hơn ngày bắt đầu!');
      return;
    }

    this.isSubmitting = true;
    const formData = this.voucherForm.value;

    if (this.isEditing && this.currentEditId) {
      // --- UPDATE ---
      this.voucherService.updateVoucher(this.currentEditId, formData).subscribe({
        next: (res) => {
          alert('Cập nhật thành công!');
          this.finalizeSubmit();
        },
        error: (err) => {
          console.error(err);
          alert('Lỗi cập nhật: ' + (err.error?.message || 'Có lỗi xảy ra'));
          this.isSubmitting = false;
        }
      });
    } else {
      // --- CREATE ---
      this.voucherService.createVoucher(formData).subscribe({
        next: (res) => {
          alert('Tạo mã khuyến mãi thành công!');
          this.finalizeSubmit();
        },
        error: (err) => {
          console.error(err);
          alert('Lỗi tạo mới: ' + (err.error?.message || 'Mã code có thể đã tồn tại'));
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteVoucher(id: number) {
    if (confirm('Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa?')) {
      this.voucherService.deleteVoucher(id).subscribe({
        next: () => {
          alert('Đã xóa thành công!');
          this.loadVouchers();
        },
        error: (err) => alert('Xóa thất bại: ' + err.message)
      });
    }
  }

  isInvalid(field: string): boolean {
    const control = this.voucherForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  private finalizeSubmit() {
    this.isSubmitting = false;
    this.showForm = false;
    this.resetFormState();
    this.loadVouchers();
  }

  private resetFormState() {
    this.isEditing = false;
    this.currentEditId = null;
    this.voucherForm.reset({
      discountType: 'PERCENT',
      usageLimit: 100,
      minOrderValue: 0,
      discountValue: 0
    });
    // Bật lại input code khi tạo mới
    this.voucherForm.get('code')?.enable();
  }
}