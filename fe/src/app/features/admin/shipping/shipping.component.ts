import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      
      <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 class="text-lg font-bold text-slate-800">Quản lý Vận chuyển & Đơn hàng</h2>
        <div class="text-sm text-slate-500">Tổng đơn: <span class="font-bold text-[#cc8d8d]">{{ totalElements() }}</span></div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th class="px-4 py-4 font-semibold w-[80px]">Mã đơn</th>
              <th class="px-4 py-4 font-semibold w-[200px]">Tài khoản</th> 
              <th class="px-4 py-4 font-semibold w-[200px]">Người nhận</th> 
              <th class="px-4 py-4 font-semibold w-[300px]">Sản phẩm</th>  
              <th class="px-4 py-4 font-semibold w-[120px]">Tổng tiền</th>
              <th class="px-4 py-4 font-semibold text-center w-[120px]">Trạng thái</th>
              <th class="px-4 py-4 font-semibold w-[200px]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of orders()" class="border-b border-slate-50 hover:bg-slate-50 transition-colors align-top">
              <td class="px-4 py-4 font-mono font-bold text-slate-700">#{{ order.id }}</td>
              <td class="px-4 py-4"><div class="text-xs font-medium text-slate-600">{{ order.user?.email || 'Vãng lai' }}</div></td>
              <td class="px-4 py-4"><div class="font-bold text-slate-800">{{ order.fullName }}</div><div class="text-xs text-slate-500">{{ order.phone }}</div></td>
              <td class="px-4 py-4">
                 <div *ngFor="let item of order.orderItems" class="text-xs mb-1">
                    {{ item.productName }} <span class="text-[#cc8d8d] font-bold">x{{ item.quantity }}</span>
                 </div>
              </td>
              <td class="px-4 py-4 font-bold text-[#cc8d8d]">{{ order.totalPrice | number:'1.0-0' }}₫<br>{{ order.paymentMethod }}</td>
              <td class="px-4 py-4 text-center">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap" [ngClass]="getStatusColor(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                    <select [ngModel]="order.status" (ngModelChange)="updateStatus(order.id, $event)"
                      [disabled]="order.status === 'CANCELLED' || order.status === 'COMPLETED'"
                      class="bg-white border border-slate-300 text-slate-700 text-xs rounded-lg block w-full p-2 shadow-sm min-w-[130px]">
                      <option *ngFor="let s of statusList" [value]="s.key">{{ s.label }}</option>
                    </select>
                    <button (click)="deleteOrder(order.id)" class="p-2 text-slate-400 hover:text-red-600 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div class="text-sm text-slate-500">
          Trang <span class="font-bold">{{ currentPage() + 1 }}</span> / {{ totalPages() }}
        </div>
        <div class="flex gap-2">
          <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0" 
            class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-100">Trước</button>
          <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
            class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-100">Sau</button>
        </div>
      </div>
    </div>
  `
})
export class ShippingComponent implements OnInit {
  orderService = inject(OrderService);
  orders = signal<any[]>([]);
  currentPage = signal(0);
  pageSize = signal(10);
  totalPages = signal(0);
  totalElements = signal(0);

  statusList = [
    { key: 'PENDING', label: 'Đang chờ xử lý' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'SHIPPING', label: 'Đang giao hàng' },
    { key: 'COMPLETED', label: 'Hoàn thành' },
    { key: 'CANCELLED', label: 'Đã hủy' }
  ];

  ngOnInit() { this.loadOrders(); }

  loadOrders() {
    this.orderService.getAllOrders(this.currentPage(), this.pageSize()).subscribe({
      next: (res: any) => {
        this.orders.set(res.content);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
      },
      error: (err) => console.error('Lỗi tải đơn hàng:', err)
    });
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.loadOrders();
    }
  }

  updateStatus(orderId: number, newStatus: string) {
    if (!confirm(`Xác nhận chuyển trạng thái đơn #${orderId}?`)) {
      this.loadOrders();
      return;
    }
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => this.loadOrders(),
      error: (err) => alert('Lỗi: ' + (err.error?.message || err.message))
    });
  }

  deleteOrder(orderId: number) {
    if (!confirm(`Xóa vĩnh viễn đơn #${orderId}?`)) return;
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        alert('Đã xóa!');
        this.loadOrders();
      },
      error: (err) => alert('Không thể xóa: ' + (err.error?.message || 'Lỗi'))
    });
  }

  getStatusLabel(status: string) { return this.statusList.find(s => s.key === status)?.label || status; }

  getStatusColor(status: string) {
    switch (status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'CONFIRMED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SHIPPING': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  }
}