import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      
      <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 class="text-lg font-bold text-slate-800">Danh sách Đơn hàng</h2>
        <div class="text-sm text-slate-500">
          Tổng số: <span class="font-bold text-[#cc8d8d]">{{ totalElements() }}</span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th class="px-4 py-4 font-semibold w-[100px]">Mã đơn</th>
              <th class="px-4 py-4 font-semibold w-[220px]">Thông tin khách</th>
              <th class="px-4 py-4 font-semibold w-[220px]">Người nhận</th>
              <th class="px-4 py-4 font-semibold min-w-[300px]">Sản phẩm</th>
              <th class="px-4 py-4 font-semibold w-[120px]">Tổng tiền</th>
              <th class="px-4 py-4 font-semibold text-center w-[150px]">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of orders()" class="border-b border-slate-50 hover:bg-slate-50 transition-colors align-top">
              
              <td class="px-4 py-4">
                <div class="font-mono font-bold text-slate-700">#{{ order.id }}</div>
                <div class="text-xs text-slate-400 mt-1">
                    {{ order.orderDate | date:'dd/MM/yyyy' }}<br>
                    {{ order.orderDate | date:'HH:mm' }}
                </div>
              </td>
              
              <td class="px-4 py-4">
                <div class="mb-2">
                    <span class="text-[10px] uppercase text-slate-400 font-bold">TK Đặt:</span>
                    <div class="text-xs font-medium text-slate-600 truncate" [title]="order.user?.email">
                        {{ order.user?.email || 'Khách vãng lai' }}
                    </div>
                </div>
              </td>

              <td class="px-4 py-4">
                <div class="font-bold text-slate-800">{{ order.fullName }}</div>
                <div class="text-xs text-slate-500">{{ order.phone }}</div>
                <div class="text-[11px] text-slate-400 italic mt-1 leading-tight">
                    {{ order.address }}, {{ order.ward }}, {{ order.district }}, {{ order.city }}
                </div>
              </td>

              <td class="px-4 py-4">
                <div class="space-y-2">
                    <div *ngFor="let item of order.orderItems" class="flex gap-3 items-start border-b border-dashed border-slate-100 last:border-0 pb-2 last:pb-0">
                        <div class="w-10 h-10 rounded border border-slate-200 overflow-hidden flex-shrink-0 bg-gray-50">
                            <img [src]="item.productImage || 'assets/img/placeholder.png'" class="w-full h-full object-cover">
                        </div>
                        <div class="flex-1">
                            <div class="text-xs font-medium text-slate-700 line-clamp-2">{{ item.productName }}</div>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded border border-slate-200">{{ item.size || 'F' }}</span>
                                <span class="text-[11px] font-bold text-[#cc8d8d]">x{{ item.quantity }}</span>
                                <span class="text-[10px] text-slate-400 ml-auto">{{ item.price | number:'1.0-0' }}₫</span>
                            </div>
                        </div>
                    </div>
                </div>
              </td>

              <td class="px-4 py-4 font-bold text-[#cc8d8d]">
                {{ order.totalPrice | number:'1.0-0' }}₫
                <div class="text-[10px] font-normal text-slate-400 uppercase mt-1 bg-slate-100 px-1 py-0.5 rounded inline-block">
                    {{ order.paymentMethod }}
                </div>
              </td>

              <td class="px-4 py-4 text-center">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap shadow-sm"
                      [ngClass]="getStatusColor(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
            </tr>
            
            <tr *ngIf="orders().length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-slate-400 bg-slate-50/50">
                    <div class="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Chưa có đơn hàng nào.
                    </div>
                </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between font-sans">
        <div class="text-sm text-slate-500">
          Hiển thị trang <span class="font-bold text-slate-700">{{ currentPage() + 1 }}</span> / {{ totalPages() }}
        </div>
        <div class="flex gap-2">
          <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
                  class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            Trước
          </button>
          <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
                  class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            Sau
          </button>
        </div>
      </div>

    </div>
  `
})
export class OrdersComponent implements OnInit {
  orderService = inject(OrderService);
  
  // Signals quản lý dữ liệu và phân trang
  orders = signal<any[]>([]);
  currentPage = signal(0);
  pageSize = signal(10);
  totalPages = signal(0);
  totalElements = signal(0);

  ngOnInit() {
    this.loadOrders();
  }

  // Load đơn hàng với tham số page và size (Fix lỗi TS2554)
  loadOrders() {
    this.orderService.getAllOrders(this.currentPage(), this.pageSize()).subscribe({
      next: (res: any) => {
        // Backend trả về Page object nên dữ liệu nằm trong content
        this.orders.set(res.content);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
      },
      error: (err) => console.error('Lỗi tải đơn hàng:', err)
    });
  }

  // Chuyển trang
  changePage(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.loadOrders();
    }
  }

  // --- Helpers ---
  getStatusLabel(status: string) {
    const map: any = {
        'PENDING': 'Đang chờ xử lý',
        'CONFIRMED': 'Đã xác nhận',
        'SHIPPING': 'Đang giao hàng',
        'COMPLETED': 'Hoàn thành',
        'CANCELLED': 'Đã hủy'
    };
    return map[status] || status;
  }

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