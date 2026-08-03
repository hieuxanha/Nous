import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 font-sans py-8">
      <div class="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div class="w-full lg:w-3/4 mx-auto"> 
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 lg:p-8">
              <h2 class="text-xl font-bold text-slate-800 mb-1">Hồ sơ của tôi</h2>
              <p class="text-sm text-slate-500 mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="flex flex-col-reverse md:flex-row gap-8">
                <div class="flex-1 space-y-5">
                    <div class="space-y-1.5">
                        <label class="text-sm font-semibold text-slate-700">Họ và tên</label>
                        <input type="text" formControlName="fullName" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D4BEA6]">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div class="space-y-1.5">
                            <label class="text-sm font-semibold text-slate-700">Email</label>
                            <input type="email" formControlName="email" class="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-sm font-semibold text-slate-700">Số điện thoại</label>
                            <input type="tel" formControlName="phone" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D4BEA6]">
                        </div>
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-sm font-semibold text-slate-700">Giới tính</label>
                        <div class="flex gap-6 mt-2">
                            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" formControlName="gender" value="male" class="text-[#B08D6D] focus:ring-[#B08D6D]"> <span class="text-sm text-slate-600">Nam</span></label>
                            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" formControlName="gender" value="female" class="text-[#B08D6D] focus:ring-[#B08D6D]"> <span class="text-sm text-slate-600">Nữ</span></label>
                            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" formControlName="gender" value="other" class="text-[#B08D6D] focus:ring-[#B08D6D]"> <span class="text-sm text-slate-600">Khác</span></label>
                        </div>
                    </div>

                    <div class="pt-4">
                        <button type="submit" [disabled]="isSaving" class="px-8 py-2.5 bg-[#B08D6D] text-white text-sm font-bold rounded-lg hover:bg-[#9A7B5E] transition shadow-md disabled:opacity-70 flex items-center gap-2">
                            <span *ngIf="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            {{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
                        </button>
                    </div>
                </div>
              </form>
            </div>
        </div>
      </div>
    </div>
  `
})
export class AccountInfoComponent implements OnInit {
  userService = inject(UserService);
  fb = inject(FormBuilder);
  
  profileForm!: FormGroup;
  isSaving = false;

  ngOnInit() {
    this.initForm();
    
    // 1. Load tạm từ LocalStorage (để hiển thị ngay lập tức)
    this.loadFromStorage();
    
    // 2. Gọi API lấy dữ liệu MỚI NHẤT từ DB (để lấy SĐT nếu localStorage thiếu)
    this.fetchLatestUserData();
  }

  initForm() {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [{value: '', disabled: true}],
      phone: ['', [Validators.pattern(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)]],
      gender: ['male']
    });
  }

  loadFromStorage() {
    const user = this.userService.currentUser();
    if (user) this.patchForm(user);
  }

  fetchLatestUserData() {
    const currentUser = this.userService.currentUser();
    if (currentUser && currentUser.id) {
        this.userService.getUserById(currentUser.id).subscribe({
            next: (serverUser) => {
                console.log('Dữ liệu mới nhất từ Server:', serverUser);
                this.patchForm(serverUser); // Cập nhật lại form với dữ liệu thật
            },
            error: (err) => console.error('Lỗi tải profile:', err)
        });
    }
  }

  // Hàm điền dữ liệu vào form (xử lý mọi trường hợp tên biến)
  patchForm(user: any) {
    this.profileForm.patchValue({
      fullName: user.fullName || user.full_name || '',
      email: user.email,
      phone: user.phone || user.phone_number || user.phoneNumber || '',
      gender: user.gender || 'male'
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
        alert("Vui lòng kiểm tra lại thông tin");
        return;
    }

    this.isSaving = true;
    const formData = this.profileForm.getRawValue();

    this.userService.updateProfile(formData).subscribe({
      next: (res) => {
        this.isSaving = false;
        alert('Cập nhật thông tin thành công!');
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        const msg = err.error?.message || 'Có lỗi xảy ra khi lưu';
        alert('Lỗi: ' + msg);
      }
    });
  }
}