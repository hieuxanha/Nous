import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Order } from '../../../core/models/order.model'; // Import Model chuẩn
@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 font-sans py-8">
      <div class="container mx-auto px-4 lg:px-8 max-w-5xl">
        
        <div class="mb-8 flex justify-between items-end">
          <div>
              <nav class="flex text-sm text-slate-500 mb-2">
                <a routerLink="/" class="hover:text-[#B08D6D]">Trang chủ</a>
                <span class="mx-2">/</span>
                <span class="text-slate-800 font-medium">Đơn hàng của tôi</span>
              </nav>
              <h1 class="text-2xl font-bold text-slate-800">Lịch sử đơn hàng</h1>
              <p class="text-slate-500 text-sm mt-1">Quản lý và theo dõi trạng thái các đơn hàng đã đặt.</p>
          </div>
          <div *ngIf="totalElements > 0" class="text-xs text-slate-500 font-medium bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
             Tổng: {{ totalElements }} đơn
          </div>
        </div>

        <div *ngIf="isLoading" class="space-y-4 animate-pulse">
            <div class="h-40 bg-white rounded-lg shadow-sm" *ngFor="let i of [1,2,3]"></div>
        </div>

        <div *ngIf="!isLoading && orders().length === 0" class="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100 min-h-[400px]">
            <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <span class="text-4xl">📦</span>
            </div>
            <h3 class="text-lg font-bold text-slate-700 mb-2">Bạn chưa có đơn hàng nào</h3>
            <p class="text-slate-500 mb-6 max-w-md">Hãy khám phá các sản phẩm tuyệt vời của Nous và đặt hàng ngay hôm nay nhé!</p>
            <a routerLink="/" class="px-6 py-2.5 bg-[#cc8d8d] text-white font-medium rounded-lg hover:bg-[#b57b7b] transition shadow-sm">
                Bắt đầu mua sắm
            </a>
        </div>

        <div *ngIf="!isLoading && orders().length > 0" class="space-y-6">
          
          <div *ngFor="let order of orders()" class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition hover:shadow-md">
            
            <div class="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-wrap gap-4 justify-between items-center">
                <div class="flex gap-4 items-center">
                    <div>
                        <span class="text-xs text-slate-500 uppercase font-semibold">Đơn hàng</span>
                        <div class="font-bold text-slate-700">#{{ order.id }}</div>
                    </div>
                    <div class="h-8 w-[1px] bg-slate-200"></div>
                    <div>
                        <span class="text-xs text-slate-500 uppercase font-semibold">Ngày đặt</span>
                        <div class="text-sm text-slate-700">{{ order.orderDate | date:'dd/MM/yyyy HH:mm' }}</div>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border"
                          [ngClass]="getStatusColor(order.status)">
                        {{ getStatusLabel(order.status) }}
                    </span>
                </div>
            </div>

            <div class="p-6">
                <div *ngFor="let item of order.orderItems" class="flex gap-4 mb-4 last:mb-0 items-start">
                    
                    <div class="w-16 h-16 rounded border border-slate-100 bg-slate-50 overflow-hidden flex-shrink-0 cursor-pointer" 
                         [routerLink]="['/product', item.product?.id]"> 
                        <img [src]="item.productImage || 'assets/img/placeholder.png'" class="w-full h-full object-cover">
                    </div>
                    
                    <div class="flex-1">
                        <h4 class="text-sm font-medium text-slate-700 line-clamp-1 hover:text-[#B08D6D] cursor-pointer" 
                            [routerLink]="['/products', item.product?.id]">
                            {{ item.productName }}
                        </h4>
                        <p class="text-xs text-slate-500 mt-1">Phân loại: {{ item.size || 'FreeSize' }}</p>
                        
                        <div class="flex flex-wrap justify-between items-end mt-2">
                             <div>
                                 <span class="text-xs text-slate-500">x{{ item.quantity }}</span>
                                 <span class="text-sm font-medium text-[#cc8d8d] ml-2">{{ item.price | number:'1.0-0' }}₫</span>
                             </div>

                             <button *ngIf="order.status === 'COMPLETED'" 
                                     [routerLink]="['/products', item.product?.id]"
                                     class="text-xs font-bold text-[#B08D6D] border border-[#B08D6D] px-3 py-1 rounded hover:bg-[#B08D6D] hover:text-white transition cursor-pointer">
                                 ★ Viết đánh giá
                             </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="text-slate-600 text-sm">
                    Tổng tiền: <span class="text-lg font-bold text-[#cc8d8d] ml-1">{{ order.totalPrice | number:'1.0-0' }}₫</span>
                </div>
                
                <div class="flex gap-3 w-full sm:w-auto">
                    <button *ngIf="order.status === 'PENDING'" 
                            (click)="cancelOrder(order.id)"
                            class="flex-1 sm:flex-none px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-red-500 transition">
                        Hủy đơn
                    </button>

                    <a [routerLink]="['/checkout/success']" [queryParams]="{id: order.id}" 
                       class="flex-1 sm:flex-none px-6 py-2 bg-[#cc8d8d] text-white rounded-lg text-sm font-medium hover:bg-[#b57b7b] transition text-center shadow-sm">
                        Xem chi tiết
                    </a>
                </div>
            </div>
          </div>

          <div *ngIf="totalPages > 1" class="flex justify-center items-center gap-3 mt-8 py-6 border-t border-slate-100 animate-fade-in">
             <button (click)="changePage(currentPage - 1)" 
                     [disabled]="currentPage === 0"
                     class="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-600 hover:bg-[#FFFBF3] hover:text-[#B08D6D] hover:border-[#D4BEA6] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm">
               ← Trước
             </button>

             <span class="px-4 py-2 text-sm text-[#B08D6D] font-bold bg-[#FFFBF3] border border-[#D4BEA6] rounded-md">
                 Trang {{ currentPage + 1 }} / {{ totalPages }}
             </span>

             <button (click)="changePage(currentPage + 1)" 
                     [disabled]="currentPage >= totalPages - 1"
                     class="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-600 hover:bg-[#FFFBF3] hover:text-[#B08D6D] hover:border-[#D4BEA6] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm">
                 Sau →
             </button>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class MyOrdersComponent implements OnInit {
  orderService = inject(OrderService);
  authService = inject(AuthService);
  
  orders = signal<any[]>([]);
  isLoading = true;

  currentPage = 0;
  pageSize = 5; 
  totalPages = 0;
  totalElements = 0;

  ngOnInit() {
    this.loadMyOrders();
  }

  loadMyOrders() {
    this.isLoading = true;
    this.orderService.getMyOrders(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        console.log('📦 API Response:', response);
        if (response.content) {
             this.orders.set(response.content);
             this.totalPages = response.totalPages;
             this.totalElements = response.totalElements;
        } else if (Array.isArray(response)) {
             this.orders.set(response);
             this.totalPages = 1;
             this.totalElements = response.length;
        } else {
             this.orders.set([]);
             this.totalPages = 0;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Lỗi tải đơn hàng:', err);
        this.isLoading = false;
      }
    });
  }

  changePage(newPage: number) {
      if (newPage >= 0 && newPage < this.totalPages) {
          this.currentPage = newPage;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.loadMyOrders();
      }
  }

  cancelOrder(orderId: number) {
    if(!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

    this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
            alert('Đã hủy đơn hàng thành công!');
            this.loadMyOrders(); 
        },
        error: (err) => alert('Lỗi: ' + err.message)
    });
  }

  getStatusLabel(status: string) {
      const map: any = { 
          'PENDING': 'Đang chờ xử lý', 
          'CONFIRMED': 'Đã xác nhận', 
          'SHIPPING': 'Đang giao hàng', 
          'COMPLETED': 'Giao thành công', 
          'CANCELLED': 'Đã hủy' 
      };
      return map[status] || status;
  }

  getStatusColor(status: string) {
      switch(status) {
          case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
          case 'CONFIRMED': return 'bg-blue-50 text-blue-700 border-blue-200';
          case 'SHIPPING': return 'bg-purple-50 text-purple-700 border-purple-200';
          case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-200';
          case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
          default: return 'bg-gray-50 text-gray-700 border-gray-200';
      }
  }
}