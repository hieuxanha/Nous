import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Nhớ import FormsModule để dùng ngModel
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      
      <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h2 class="text-lg font-bold text-slate-800">Phân quyền Người dùng</h2>
          <p class="text-xs text-slate-500 mt-1">Cấp quyền truy cập hệ thống (Admin/User)</p>
        </div>
        <div class="text-sm text-slate-500">Tổng tài khoản: <span class="font-bold text-[#cc8d8d]">{{ users().length }}</span></div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th class="px-6 py-4 font-semibold w-[80px]">ID</th>
              <th class="px-6 py-4 font-semibold">Thông tin tài khoản</th>
              <th class="px-6 py-4 font-semibold">Liên hệ</th>
              <th class="px-6 py-4 font-semibold w-[200px]">Quyền hạn (Role)</th>
              <th class="px-6 py-4 font-semibold w-[150px] text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users()" class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              
              <td class="px-6 py-4 text-slate-400 font-mono">#{{ user.id }}</td>
              
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm uppercase border shadow-sm"
                       [ngClass]="getAvatarColor(user)">
                    {{ getInitials(user.fullName) }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-800">{{ user.fullName }}</div>
                    <div class="text-xs text-slate-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="text-slate-700 font-medium">{{ user.phone || '---' }}</div>
                <div class="text-[11px] text-slate-400 mt-0.5 capitalize">
                   {{ user.gender ? 'Giới tính: ' + user.gender : '' }}
                </div>
              </td>

              <td class="px-6 py-4">
                <select 
                    [ngModel]="getCurrentRole(user.roles)" 
                    (ngModelChange)="changeRole(user, $event)"
                    class="bg-white border border-slate-300 text-slate-700 text-xs rounded-lg focus:ring-[#cc8d8d] focus:border-[#cc8d8d] block w-full p-2.5 cursor-pointer shadow-sm font-medium">
                    
                    <option value="ROLE_USER">Khách hàng (User)</option>
                    <option value="ROLE_ADMIN">Quản trị viên (Admin)</option>
                </select>
              </td>

              <td class="px-6 py-4 text-right">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border"
                      [ngClass]="getRoleBadgeClass(user.roles)">
                  {{ getRoleLabel(user.roles) }}
                </span>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RolesComponent implements OnInit {
  userService = inject(UserService);
  users = signal<any[]>([]);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        // Sắp xếp: Admin lên đầu, sau đó theo ID
        const sorted = data.sort((a: any, b: any) => {
             const roleA = this.getCurrentRole(a.roles);
             const roleB = this.getCurrentRole(b.roles);
             if (roleA === roleB) return a.id - b.id;
             return roleA === 'ROLE_ADMIN' ? -1 : 1;
        });
        this.users.set(sorted);
      },
      error: (err) => console.error('Lỗi tải user:', err)
    });
  }

  changeRole(user: any, newRole: string) {
    const currentRole = this.getCurrentRole(user.roles);
    
    // Nếu chọn lại quyền cũ thì không làm gì
    if (currentRole === newRole) return;

    if (!confirm(`Bạn có chắc muốn đổi quyền của "${user.fullName}" thành ${newRole === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}?`)) {
        this.loadUsers(); // Reset lại nếu hủy
        return;
    }

    this.userService.updateRole(user.id, newRole).subscribe({
        next: () => {
            alert('Cập nhật quyền thành công!');
            this.loadUsers(); // Tải lại danh sách để cập nhật giao diện
        },
        error: (err) => {
            alert('Lỗi: ' + err.message);
            this.loadUsers();
        }
    });
  }

  // --- Helpers ---

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  }

  // Lấy role hiện tại từ mảng roles (backend trả về mảng/set object)
  getCurrentRole(roles: any[]): string {
    if (!roles || roles.length === 0) return 'ROLE_USER';
    // Xử lý trường hợp role là object {id: 1, name: 'ROLE_ADMIN'} hoặc string
    const role = roles[0].name || roles[0]; 
    return role.toString();
  }

  getRoleLabel(roles: any[]): string {
    const role = this.getCurrentRole(roles);
    return role === 'ROLE_ADMIN' ? 'Admin' : 'User';
  }

  getRoleBadgeClass(roles: any[]): string {
    const role = this.getCurrentRole(roles);
    return role === 'ROLE_ADMIN' 
        ? 'bg-purple-50 text-purple-700 border-purple-200' 
        : 'bg-green-50 text-green-700 border-green-200';
  }

  getAvatarColor(user: any): string {
      const role = this.getCurrentRole(user.roles);
      return role === 'ROLE_ADMIN'
        ? 'bg-purple-100 text-purple-600 border-purple-200'
        : 'bg-slate-100 text-slate-500 border-slate-200';
  }
}