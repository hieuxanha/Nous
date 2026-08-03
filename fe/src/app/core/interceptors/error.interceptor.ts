import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: any) => {
      console.error('API Error:', error);

      if (error.status === 401) {
        console.warn('Bạn chưa đăng nhập');
      }

      if (error.status === 403) {
        console.warn('Không có quyền truy cập');
      }

      return throwError(() => error);
    })
  );
};
