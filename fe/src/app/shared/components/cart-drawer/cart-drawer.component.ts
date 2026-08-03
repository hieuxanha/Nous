import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div 
      class="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
      [class.opacity-0]="!cartService.isOpen()"
      [class.pointer-events-none]="!cartService.isOpen()"
      (click)="cartService.close()"
    ></div>

    <div 
      class="fixed inset-y-0 right-0 z-[70] w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col"
      [class.translate-x-0]="cartService.isOpen()"
      [class.translate-x-full]="!cartService.isOpen()"
    >
      
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
        <h2 class="text-lg font-bold text-slate-700 tracking-wide">GIỎ HÀNG ({{ totalCount() }})</h2>
        <button (click)="cartService.close()" class="p-2 -mr-2 text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-4">
        
        <div *ngIf="cartItems().length === 0" class="flex flex-col items-center justify-center h-full text-slate-500">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mb-4 opacity-50">
             <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
           </svg>
           <p>Giỏ hàng của bạn đang trống</p>
           <button (click)="cartService.close()" class="mt-4 px-6 py-2 bg-[#D4BEA6] text-white rounded-full text-sm font-bold hover:bg-[#B08D6D]">
             Mua sắm ngay
           </button>
        </div>

        <ng-container *ngIf="cartItems().length > 0">
            <div class="mb-6">
                <div class="flex items-center gap-1 text-sm text-slate-600 mb-2">
                    <ng-container *ngIf="remainingForFreeShip() > 0; else freeShipSuccess">
                        <span>Mua thêm</span>
                        <span class="text-[#D4BEA6] font-bold">{{ remainingForFreeShip() | number:'1.0-0' }}₫</span>
                        <span>để được Freeship</span>
                    </ng-container>
                    <ng-template #freeShipSuccess>
                        <span class="text-green-600 font-bold flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                            Bạn đã được Freeship!
                        </span>
                    </ng-template>
                </div>
                <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-[#D4BEA6] transition-all duration-500" [style.width.%]="progressPercent()"></div>
                </div>
            </div>

            <div class="space-y-6">
                <div *ngFor="let item of cartItems()" class="flex gap-4 group">
                    <div class="w-24 h-24 flex-shrink-0 border border-slate-100 rounded-sm overflow-hidden">
                        <img [src]="item.image" class="w-full h-full object-cover" [alt]="item.name" onerror="this.src='assets/img/placeholder.png'">
                    </div>
                    
                    <div class="flex-1 flex flex-col">
                        <h3 class="text-sm font-medium text-slate-700 leading-5 mb-1 line-clamp-2">
                            <a [routerLink]="['/products', item.productId]" (click)="cartService.close()" class="hover:text-[#D4BEA6]">
                                {{ item.name }}
                            </a>
                        </h3>
                        <div class="text-xs text-slate-500 mb-2">Mã sản phẩm : {{ item.sku }}</div>
                        <div class="text-sm font-bold text-slate-800 mb-3">{{ item.price | number:'1.0-0' }}₫</div>
                        
                        <div class="flex items-center justify-between mt-auto">
                            <div class="flex items-center border border-slate-300 rounded-sm h-8">
                                <button (click)="decrement(item)" class="w-8 h-full flex items-center justify-center hover:bg-slate-50 text-slate-500 disabled:opacity-50" [disabled]="isProcessing">-</button>
                                <input type="text" [value]="item.quantity" class="w-8 h-full text-center text-sm border-x border-slate-300 focus:outline-none text-slate-700 font-semibold" readonly>
                                <button (click)="increment(item)" class="w-8 h-full flex items-center justify-center hover:bg-slate-50 text-slate-500 disabled:opacity-50" [disabled]="isProcessing">+</button>
                            </div>
                            
                            <button (click)="removeItem(item.id)" class="text-xs text-slate-400 hover:text-red-500 border-b border-transparent hover:border-red-500 transition-colors">
                                XÓA
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ng-container>
      </div>

      <div *ngIf="cartItems().length > 0" class="border-t border-slate-100 p-6 bg-white flex-shrink-0">
        
        <div class="flex justify-between items-center text-xs text-slate-500 mb-4">
           <span class="cursor-pointer hover:text-[#D4BEA6]">Thêm ghi chú</span>
           <a routerLink="/cart" (click)="cartService.close()" class="cursor-pointer hover:text-[#D4BEA6] hover:underline">
             Xem chi tiết giỏ hàng
           </a>
        </div>

        <div class="mb-4 text-sm text-slate-700">
          Phí ship & thuế được tính ở Trang Thanh Toán
        </div>

        <a 
          routerLink="/checkout"
          (click)="cartService.close()"
          class="w-full py-3.5 bg-[#D58F83] text-white font-bold text-sm uppercase rounded-sm hover:bg-[#c47f73] transition shadow-md flex justify-center gap-2 cursor-pointer"
        >
          <span>THANH TOÁN</span>
          <span>•</span>
          <span>{{ totalPrice() | number:'1.0-0' }}₫</span>
        </a>
      </div>

    </div>
  `
})
export class CartDrawerComponent {
  cartService = inject(CartService);

  // Computed Signals để lấy dữ liệu tự động cập nhật từ Service
  cartItems = computed(() => this.cartService.cart()?.items || []);
  totalPrice = computed(() => this.cartService.cart()?.totalCartPrice || 0);
  totalCount = computed(() => this.cartService.cart()?.totalItemCount || 0);

  // Logic tính Free Ship (Ví dụ mốc 500k)
  freeShipThreshold = 500000;
  remainingForFreeShip = computed(() => Math.max(0, this.freeShipThreshold - this.totalPrice()));
  progressPercent = computed(() => Math.min(100, (this.totalPrice() / this.freeShipThreshold) * 100));

  isProcessing = false; // Biến chặn spam click

  // --- ACTIONS ---

  increment(item: CartItem) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.cartService.updateQuantity(item.id, item.quantity + 1).subscribe({
        next: () => this.isProcessing = false,
        error: () => this.isProcessing = false
    });
  }

  decrement(item: CartItem) {
    if (item.quantity <= 1 || this.isProcessing) return;
    this.isProcessing = true;
    this.cartService.updateQuantity(item.id, item.quantity - 1).subscribe({
        next: () => this.isProcessing = false,
        error: () => this.isProcessing = false
    });
  }

  removeItem(cartItemId: number) {
    // Không cần confirm ở Drawer cho nhanh (hoặc tùy bạn)
    this.isProcessing = true;
    this.cartService.removeItem(cartItemId).subscribe({
        next: () => this.isProcessing = false,
        error: () => this.isProcessing = false
    });
  }
}