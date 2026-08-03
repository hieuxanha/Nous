import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Lấy token từ localStorage
  const token = localStorage.getItem('token');

  // 2. Nếu có token, clone request và gắn Header vào
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // 3. Nếu không có token, cứ gửi request trần
  return next(req);
};