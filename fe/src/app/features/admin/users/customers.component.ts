import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      
      <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h2 class="text-lg font-bold text-slate-800">Quản lý Khách hàng</h2>
          <p class="text-xs text-slate-500 mt-1">Danh sách người dùng đã đăng ký hệ thống</p>
        </div>
        <div class="text-sm text-slate-500">Tổng: <span class="font-bold text-[#cc8d8d]">{{ users().length }}</span></div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th class="px-6 py-4 font-semibold w-[80px]">ID</th>
              <th class="px-6 py-4 font-s qemibold">Thông tin khách hàng</th>
              <th class="px-6 py-4 font-semibold">Số điện thoại</th>
              <th class="px-6 py-4 font-semibold text-center">Vai trò</th>
              <th class="px-6 py-4 font-semibold text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users()" class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              
              <td class="px-6 py-4 text-slate-400">#{{ user.id }}</td>
              
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-[#cc8d8d]/10 text-[#cc8d8d] flex items-center justify-center font-bold text-sm uppercase border border-[#cc8d8d]/20">
                    {{ getInitials(user.fullName) }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-800">{{ user.fullName }}</div>
                    <div class="text-xs text-slate-500">{{ user.email }}</div>
                    <div class="text-[10px] text-slate-400" *ngIf="user.gender">Giới tính: {{ user.gender }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 text-slate-600 font-medium">
                {{ user.phone || '---' }}
              </td>

              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border"
                      [ngClass]="getRoleClass(user.roles)"> 
                  {{ getRoleName(user.roles) }}
                </span>
              </td>

              <td class="px-6 py-4 text-right">
                <button (click)="deleteUser(user)" class="text-slate-400 hover:text-red-600 transition-colors p-2" title="Xóa người dùng">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </td>

            </tr>

            <tr *ngIf="users().length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-slate-400 bg-slate-50/50">
                    Chưa có khách hàng nào.
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class CustomersComponent implements OnInit {
  userService = inject(UserService);
  users = signal<any[]>([]);

  ngOnInit() {
    this.loadUsers();
  }

loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        // LỌC Ở FRONTEND: Loại bỏ user có role chứa 'ROLE_ADMIN'
        const onlyCustomers = data.filter((u: any) => 
            !u.roles.some((r: any) => r.name === 'ROLE_ADMIN')
        );
        
        this.users.set(onlyCustomers);
      },
      error: (err : any) => console.error('Lỗi tải danh sách user:', err)
    });
  }

  deleteUser(user: any) {
    // Chặn xóa chính mình hoặc Admin khác nếu cần logic đó
    if (!confirm(`Bạn có chắc muốn xóa người dùng "${user.fullName}" không?`)) return;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        alert('Đã xóa thành công!');
        // Cập nhật lại list mà không cần gọi API
        this.users.update(current => current.filter(u => u.id !== user.id));
      },
      error: (err : any) => alert('Không thể xóa: ' + err.message)
    });
  }

  // --- Helpers ---

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  }

  // Xử lý hiển thị Role (Vì trong DB Role lưu là Set hoặc List object)
  getRoleName(roles: any[]): string {
    if (!roles || roles.length === 0) return 'Khách hàng';
    // Giả sử roles là mảng object [{id:1, name:'ROLE_ADMIN'}]
    const roleName = roles[0].name || roles[0]; 
    return roleName === 'ROLE_ADMIN' ? 'Quản trị viên' : 'Khách hàng';
  }

  getRoleClass(roles: any[]): string {
    const roleName = this.getRoleName(roles);
    if (roleName === 'Quản trị viên') {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}