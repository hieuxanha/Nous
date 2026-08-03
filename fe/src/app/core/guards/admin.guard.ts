import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.currentUser();

  // 1. Kiểm tra đã đăng nhập chưa
  if (!user) {
    router.navigate(['/login']); // Chưa đăng nhập -> đá về Login
    return false;
  }

  // 2. Kiểm tra có phải Admin không
  // (Giả sử trong User model có trường role hoặc roles)
  if (user.role === 'ROLE_ADMIN' || (Array.isArray(user.roles) && user.roles.includes('ROLE_ADMIN'))) {
      return true; // Cho phép vào
  }

  // 3. Đăng nhập rồi nhưng không phải Admin -> đá về trang chủ
  alert('Bạn không có quyền truy cập trang này!');
  router.navigate(['/']);
  return false;
};