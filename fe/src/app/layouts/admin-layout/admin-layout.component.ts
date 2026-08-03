import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service'; // 1. Import AuthService

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-50 flex font-sans">

      <aside 
        class="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
        [ngClass]="{'translate-x-0': isSidebarOpen(), '-translate-x-full': !isSidebarOpen()}"
      >
        <div class="h-16 flex items-center justify-center border-b border-slate-100">
          <a routerLink="/admin" class="text-2xl font-bold text-slate-700 tracking-tighter flex items-center gap-2">
            <span class="text-rose-500">Admin</span>Panel
          </a>
        </div>

        <nav class="p-3 space-y-1 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
          
          <ng-container *ngFor="let item of menuItems">
            <a [routerLink]="item.path" 
               routerLinkActive="bg-rose-50 text-rose-600" 
               [routerLinkActiveOptions]="{exact: item.path === '/admin'}"
               class="flex items-center gap-3 px-4 py-3 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-rose-600 transition-all group">
              
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="item.icon" />
              </svg>
              
              <span class="font-medium text-[13.5px]">{{ item.label }}</span>
            </a>
          </ng-container>

          <div class="pt-4 mt-4 border-t border-slate-100 pb-6">
            <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-3 text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
               </svg>
               <span class="font-medium text-sm">Đăng xuất</span>
            </button>
          </div>

        </nav>
      </aside>

      <div *ngIf="isSidebarOpen()" (click)="toggleSidebar()" class="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>

      <div class="flex-1 flex flex-col min-w-0">
        
        <header class="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 shadow-sm">
          <button (click)="toggleSidebar()" class="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wide hidden sm:block">Hệ thống quản trị</h2>

          <div class="flex items-center gap-3 ml-auto">
            <div class="text-right hidden sm:block">
              <div class="text-sm font-bold text-slate-700">
                {{ authService.currentUser()?.fullName || 'Administratorrr' }}
              </div>
              <div class="text-[11px] text-slate-400">
                {{ authService.currentUser()?.role || 'Admin' }}
              </div>
            </div>
            
            <div class="h-9 w-9 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-sm border border-rose-200">
              {{ authService.currentUser()?.fullName?.charAt(0) || 'A' }}
            </div>
          </div>
        </header>

        <main class="flex-1 p-4 lg:p-8 overflow-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
  `]
})
export class AdminLayoutComponent {
  isSidebarOpen = signal(false);
  
  // 2. Inject Service
  authService = inject(AuthService);
  private router = inject(Router);

  menuItems = [
    { 
      path: "/admin", 
      label: "Trang chủ", 
      icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" 
    },
    { 
      path: "/admin/products", 
      label: "Quản lý sản phẩm", 
      icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3.251l0 6m0-6l-3.375 3.375M12 10.75l3.375 3.375M12 10v-3.75m8.25-2.25H3.75m16.5 0V5.25m0 3L12 1.5l-8.25 3.75" 
    },
    { 
      path: "/admin/categories", 
      label: "Quản lý danh mục", 
      icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" 
    },
    { 
      path: "/admin/shipping", 
      label: "Quản lý vận chuyển", 
      icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" 
    },
    { 
      path: "/admin/orders", 
      label: "Quản lý đơn hàng", 
      icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" 
    },
    { 
      path: "/admin/reviews", 
      label: "Quản lý đánh giá", 
      icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" 
    },
    // { 
    //   path: "/admin/employees", 
    //   label: "Quản lý Nhân viên", 
    //   icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" 
    // },
    { 
      path: "/admin/customers", 
      label: "Quản lý khách hàng", 
      icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" 
    },
    { 
      path: "/admin/roles", 
      label: "Quản lý phân quyền", 
      icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" 
    },
    { 
      path: "/admin/inventory", 
      label: "Quản lý tồn kho", 
      icon: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" 
    },
    { 
      path: "/admin/coupons", 
      label: "Quản lý mã giảm giá", 
      icon: "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" 
    },
    { 
      path: "/admin/stats", 
      label: "Thống kê", 
      icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" 
    }
  ];

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  // 3. Hàm logout dùng AuthService
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Chuyển hướng về trang đăng nhập
  }
}