import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white font-sans text-slate-700" *ngIf="order">
      <div class="max-w-3xl mx-auto px-4 py-12">

        <div class="text-center mb-10">
           <div *ngIf="order.status !== 'CANCELLED'; else cancelIcon" class="inline-flex mb-4">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce-slow">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                 </svg>
              </div>
           </div>
           <ng-template #cancelIcon>
              <div class="inline-flex mb-4">
                  <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                     </svg>
                  </div>
              </div>
           </ng-template>

           <h2 class="text-3xl font-bold mb-2 uppercase tracking-wide" 
               [ngClass]="order.status === 'CANCELLED' ? 'text-red-500' : 'text-[#cc8d8d]'">
               {{ order.status === 'CANCELLED' ? 'Đơn hàng đã hủy' : 'Đặt hàng thành công' }}
           </h2>
           <p class="text-gray-500">
               {{ order.status === 'CANCELLED' ? 'Đơn hàng này đã bị hủy.' : 'Cảm ơn bạn đã mua sắm tại Nous. Đơn hàng của bạn đang được xử lý.' }}
           </p>
        </div>

        <div *ngIf="order.status !== 'CANCELLED'" class="relative mb-12 max-w-2xl mx-auto px-4">
          <div class="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
          <div class="absolute top-1/2 left-4 h-1 bg-[#cc8d8d] -translate-y-1/2 z-0 transition-all duration-1000 ease-out"
               [style.width.%]="getProgressWidth()"></div>

          <div class="relative z-10 flex justify-between w-full">
             <div *ngFor="let step of steps; let i = index" class="flex flex-col items-center cursor-default group">
                 <div class="w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-sm"
                      [ngClass]="getStepCircleClass(i)">
                    <svg *ngIf="currentStepIndex > i" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <div *ngIf="currentStepIndex === i" class="w-2.5 h-2.5 rounded-full bg-[#cc8d8d]"></div>
                 </div>
                 <span class="text-xs font-bold mt-2 transition-colors duration-300 text-center w-24"
                       [ngClass]="i <= currentStepIndex ? 'text-[#cc8d8d]' : 'text-gray-400'">
                    {{ step.label }}
                 </span>
             </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div class="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-6 border-b border-gray-200 border-dashed">
                <div>
                    <h3 class="font-bold text-slate-800 mb-2">Thông tin người nhận</h3>
                    <p class="font-medium text-[#cc8d8d]">{{ order.fullName }} ({{ order.phone }})</p>
                    <p class="text-sm text-gray-500 mt-1">
                        {{ order.address }}, {{ order.ward }}, {{ order.district }}, {{ order.city }}
                    </p>
                </div>
                <div class="text-left md:text-right">
                    <p class="text-sm text-gray-500">Mã đơn hàng</p>
                    <p class="font-mono font-bold text-lg text-slate-800">#{{ order.id }}</p>
                    <p class="text-xs text-gray-400 mt-1 uppercase">{{ order.paymentMethod }}</p>
                    <span class="inline-flex items-center gap-1 mt-2 px-2.5 py-1 text-xs font-bold rounded"
                          [ngClass]="getStatusBadgeClass()">
                        {{ getStatusLabel() }}
                    </span>
                </div>
            </div>

            <div class="space-y-4 mb-6">
                <div *ngFor="let item of order.orderItems" class="flex gap-4 items-center">
                    <div class="w-16 h-16 border border-gray-200 rounded-md overflow-hidden bg-white flex-shrink-0">
                        <img [src]="item.productImage || 'assets/img/placeholder.png'" 
                             class="w-full h-full object-cover"
                             onerror="this.src='assets/img/placeholder.png'">
                    </div>
                    
                    <div class="flex-1">
                        <h4 class="text-sm font-medium text-slate-700 line-clamp-2">{{ item.productName }}</h4>
                        <p *ngIf="item.size" class="text-xs text-gray-500 mt-1">Size: {{ item.size }}</p>
                    </div>
                    
                    <div class="text-right">
                        <p class="text-sm font-bold text-slate-700">
                            {{ (item.price || 0) | number:'1.0-0' }}₫
                        </p>
                        <p class="text-xs text-gray-500">x{{ item.quantity }}</p>
                    </div>
                </div>
            </div>

            <div class="border-t border-gray-200 border-dashed pt-4 space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Tạm tính</span>
                    <span class="font-medium">{{ (order.totalPrice || 0) | number:'1.0-0' }}₫</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Phí vận chuyển</span>
                    <span class="text-green-600 font-medium">Miễn phí</span>
                </div>
                <div class="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                    <span>Tổng cộng</span>
                    <span class="text-[#cc8d8d]">{{ (order.totalPrice || 0) | number:'1.0-0' }}₫</span>
                </div>
            </div>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/" class="w-full sm:w-auto px-8 py-3 bg-[#cc8d8d] text-white rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-[#b57b7b] transition shadow-lg text-center cursor-pointer">
                Tiếp tục mua sắm
            </a>
            <a routerLink="/account/orders" class="w-full sm:w-auto px-8 py-3 bg-white border border-gray-300 text-slate-600 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-gray-50 hover:text-slate-800 transition text-center cursor-pointer">
                Xem đơn hàng
            </a>
            <button *ngIf="order.status === 'PENDING' || order.status === 'CONFIRMED'" (click)="cancelOrder()" class="w-full sm:w-auto px-8 py-3 bg-white border border-red-300 text-red-600 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-red-50 transition text-center cursor-pointer">
                Hủy đơn hàng
            </button>
        </div>

      </div>
    </div>
    
    <div *ngIf="!order" class="min-h-screen flex items-center justify-center">
        <p class="text-gray-500 animate-pulse">Đang tải thông tin đơn hàng...</p>
    </div>
  `,
  styles: [`
    .animate-bounce-slow { animation: bounce 2s infinite; }
    @keyframes bounce {
        0%, 100% { transform: translateY(-5%); }
        50% { transform: translateY(0); }
    }
  `]
})
export class OrderSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  
  orderId: any;
  order: any = null;

  steps = [
    { key: 'PENDING', label: 'Đang chờ xử lý' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'SHIPPING', label: 'Đang giao hàng' },
    { key: 'COMPLETED', label: 'Hoàn thành' }
  ];

  ngOnInit() {
      this.route.queryParams.subscribe(params => {
          this.orderId = params['id'];
          if (this.orderId) {
              this.fetchOrderDetails();
          }
      });
  }

  fetchOrderDetails() {
      this.orderService.getOrderById(this.orderId).subscribe({
          next: (data) => {
              this.order = data;
              console.log('Order Data loaded:', this.order);
          },
          error: (err) => console.error('Error loading order:', err)
      });
  }

  get currentStepIndex() {
      if (!this.order) return 0;
      const idx = this.steps.findIndex(s => s.key === this.order.status);
      return idx >= 0 ? idx : 0;
  }

  getProgressWidth() {
      const totalSteps = this.steps.length - 1;
      const progress = (this.currentStepIndex / totalSteps) * 100;
      return Math.min(100, Math.max(0, progress));
  }

  getStepCircleClass(index: number) {
      if (index < this.currentStepIndex) {
          return 'bg-[#cc8d8d] border-[#cc8d8d]';
      } else if (index === this.currentStepIndex) {
          return 'bg-white border-[#cc8d8d]';
      } else {
          return 'bg-gray-200 border-white';
      }
  }

  getStatusLabel() {
      const map: any = {
          'PENDING': 'Đang chờ xử lý',
          'CONFIRMED': 'Đã xác nhận',
          'SHIPPING': 'Đang giao hàng',
          'COMPLETED': 'Hoàn thành',
          'CANCELLED': 'Đã hủy'
      };
      return map[this.order.status] || this.order.status;
  }

  getStatusBadgeClass() {
      switch(this.order.status) {
          case 'PENDING': return 'bg-yellow-100 text-yellow-700';
          case 'CONFIRMED': return 'bg-blue-100 text-blue-700';
          case 'SHIPPING': return 'bg-purple-100 text-purple-700';
          case 'COMPLETED': return 'bg-green-100 text-green-700';
          case 'CANCELLED': return 'bg-red-100 text-red-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  }

 // Trong OrderSuccessComponent

  cancelOrder() {
      if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
          return;
      }

      // Gọi service
      this.orderService.cancelOrder(this.orderId).subscribe({
          next: (updatedOrder) => {
              alert('Đã hủy đơn hàng thành công!');
              // Cập nhật lại dữ liệu trên giao diện ngay lập tức
              this.order = updatedOrder; 
          },
          error: (err) => {
              const msg = err.error?.message || 'Không thể hủy đơn hàng lúc này';
              alert('Lỗi: ' + msg);
          }
      });
  }
}