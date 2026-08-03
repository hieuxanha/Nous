import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[60vh] flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div class="max-w-sm w-full space-y-8">
        
        <div class="text-center"> 
          <h2 class="text-xl font-bold text-[#58595B] uppercase tracking-wide">ĐĂNG NHẬP</h2>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-5">
          
          <div>
            <label class="block text-xs text-gray-500 mb-1">Email *</label>
            <input 
              type="email" 
              formControlName="email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            >
            <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="text-red-500 text-[10px] mt-1">
                Email không hợp lệ
            </div>
          </div>

          <div>
            <label class="block text-xs text-gray-500 mb-1">Mật khẩu *</label>
            <input 
              type="password" 
              formControlName="password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            >
            <div class="text-right mt-1">
              <a href="#" class="text-xs text-gray-500 hover:text-blue-600 italic">Quên mật khẩu?</a>
            </div>
          </div>

          <div *ngIf="errorMessage" class="text-red-500 text-xs text-center">
            {{ errorMessage }}
          </div>

          <div>
            <button 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase text-white bg-[#555555] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 disabled:opacity-50"
            >
              {{ isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP' }}
            </button>
          </div>

          <div class="relative flex items-center justify-center my-6">
            <div class="border-t border-gray-200 w-full absolute"></div>
            <span class="bg-white px-3 text-xs text-gray-500 relative z-10">Hoặc</span>
          </div>

          <div>
            <a routerLink="/register" class="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-bold uppercase text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition duration-300">
              ĐĂNG KÝ
            </a>
          </div>

        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Gọi API
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          console.log('Login success component:', res);

          // ---------------------------------------------------------
          // ⚠️ QUAN TRỌNG: ĐÃ XÓA CODE TỰ LƯU LOCALSTORAGE Ở ĐÂY
          // AuthService đã làm việc đó rồi, Component chỉ lo điều hướng thôi
          // ---------------------------------------------------------

          alert('Đăng nhập thành công!');

          // Lấy thông tin User chuẩn từ Service để kiểm tra quyền
          const currentUser = this.authService.currentUser();
          const role = currentUser?.role || '';

          // Logic điều hướng
          if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
             console.log('User is Admin -> Go to Dashboard');
             this.router.navigate(['/admin']);
          } else {
             console.log('User is Customer -> Go to Home');
             this.router.navigate(['/']);
          }        
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error('Login error:', err);
          
          if (err.status === 401) {
            this.errorMessage = 'Sai email hoặc mật khẩu!';
          } else {
            this.errorMessage = 'Lỗi kết nối server, vui lòng thử lại.';
          }
        }
      });
    } else {
        this.loginForm.markAllAsTouched();
    }
  }
}