import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[60vh] flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div class="max-w-sm w-full space-y-8">
        
        <div class="text-center">
          <h2 class="text-xl font-bold text-[#58595B] uppercase tracking-wide">ĐĂNG KÝ TÀI KHOẢN</h2>
        </div>

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-5">
          
          <div>
            <label class="block text-xs text-gray-500 mb-1">Họ và tên của bạn*</label>
            <input 
              type="text" 
              formControlName="fullName"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
              [class.border-red-500]="isFieldInvalid('fullName')"
            >
            <div *ngIf="isFieldInvalid('fullName')" class="text-red-500 text-[10px] mt-1 italic">
                Vui lòng nhập họ và tên.
            </div>
          </div>

          <div>
            <label class="block text-xs text-gray-500 mb-2">Giới tính</label>
            <div class="flex gap-8">
              <label class="inline-flex items-center cursor-pointer">
                <input type="radio" formControlName="gender" value="nu" class="form-radio text-blue-600 h-4 w-4 border-gray-300">
                <span class="ml-2 text-sm text-gray-700">Nữ</span>
              </label>
              <label class="inline-flex items-center cursor-pointer">
                <input type="radio" formControlName="gender" value="nam" class="form-radio text-blue-600 h-4 w-4 border-gray-300">
                <span class="ml-2 text-sm text-gray-700">Nam</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs text-gray-500 mb-1">Email *</label>
            <input 
              type="email" 
              formControlName="email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
              [class.border-red-500]="isFieldInvalid('email')"
            >
            <div *ngIf="isFieldInvalid('email')" class="text-red-500 text-[10px] mt-1 italic">
                <span *ngIf="signupForm.get('email')?.hasError('required')">Vui lòng nhập email.</span>
                <span *ngIf="signupForm.get('email')?.hasError('email')">Email không đúng định dạng.</span>
            </div>
          </div>

          <div>
            <label class="block text-xs text-gray-500 mb-1">Số điện thoại *</label>
            <input 
              type="tel" 
              formControlName="phone"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
              [class.border-red-500]="isFieldInvalid('phone')"
            >
            <div *ngIf="isFieldInvalid('phone')" class="text-red-500 text-[10px] mt-1 italic">
                Vui lòng nhập số điện thoại.
            </div>
          </div>

          <div>
            <label class="block text-xs text-gray-500 mb-1">Mật khẩu *</label>
            <p class="text-[10px] text-gray-400 italic mb-1">Mật khẩu tối thiểu 8 ký tự.</p>
            <input 
              type="password" 
              formControlName="password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
              [class.border-red-500]="isFieldInvalid('password')"
            >
             <div *ngIf="isFieldInvalid('password')" class="text-red-500 text-[10px] mt-1 italic">
                <span *ngIf="signupForm.get('password')?.hasError('required')">Vui lòng nhập mật khẩu.</span>
                <span *ngIf="signupForm.get('password')?.hasError('minlength')">Mật khẩu phải có ít nhất 8 ký tự.</span>
            </div>
          </div>

          <div *ngIf="errorMessage" class="p-3 bg-red-100 border border-red-400 text-red-700 text-xs rounded">
            {{ errorMessage }}
          </div>

          <div>
            <button 
              type="submit" 
              [disabled]="signupForm.invalid || isLoading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase text-white bg-[#555555] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 disabled:opacity-50"
            >
              {{ isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ' }}
            </button>
          </div>

          <div class="relative flex items-center justify-center my-6">
            <div class="border-t border-gray-200 w-full absolute"></div>
            <span class="bg-white px-3 text-xs text-gray-500 relative z-10">Hoặc</span>
          </div>

          <div>
            <a routerLink="/login" class="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-bold uppercase text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition duration-300">
              ĐĂNG NHẬP
            </a>
          </div>

        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  signupForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    gender: ['nu'],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.signupForm.valid) {
      this.isLoading = true;
      this.authService.register(this.signupForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          alert('Đăng ký thành công! Vui lòng đăng nhập.');
          this.router.navigate(['/login']);
        },
        // [FIX LỖI] Thêm type ": any" vào đây
        error: (err: any) => { 
          this.isLoading = false;
          console.error('Register error:', err);

          if (err.status === 409) {
             this.errorMessage = 'Email này đã được sử dụng. Vui lòng chọn email khác.';
          } else if (err.status === 400) {
             this.errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
          } else {
             if (err.status === 200) {
                 alert('Đăng ký thành công! (Lỗi parse JSON)');
                 this.router.navigate(['/login']);
             } else {
                 this.errorMessage = 'Lỗi hệ thống (' + err.status + '). Vui lòng thử lại sau.';
             }
          }
        }
      });
    } else {
        this.signupForm.markAllAsTouched();
    }
  }
}