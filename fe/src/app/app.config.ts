import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; // Import withInterceptors
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor'; // Import file vừa tạo

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // Đăng ký Interceptor tại đây
    provideHttpClient(withFetch(),
     withInterceptors([authInterceptor])) 
    
  ]
};