import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 

// Import Service và Model
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
  template: `
    <div class="bg-white min-h-screen font-sans text-slate-600 pb-20">
      
      <div class="container mx-auto px-4 py-4 text-xs text-slate-500 mb-4">
        <a routerLink="/" class="hover:text-slate-800">Trang chủ</a>
        <span class="mx-2">/</span>
        <span class="text-slate-800 font-medium">Giỏ hàng</span>
      </div>

      <div class="container mx-auto px-4">
        <h1 class="text-2xl font-bold text-slate-800 mb-8 uppercase tracking-wide">Giỏ hàng</h1>

        <div *ngIf="isLoading" class="flex justify-center py-10">
           <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D58F83]"></div>
        </div>

        <div *ngIf="!isLoading">
            <div class="flex flex-col lg:flex-row gap-8 lg:gap-12" *ngIf="cartItems().length > 0; else emptyCart">
            
            <div class="flex-1">
                <div class="hidden md:grid grid-cols-12 gap-4 border-b border-slate-200 pb-2 mb-4 text-xs font-bold uppercase text-slate-500">
                <div class="col-span-6">Thông tin sản phẩm</div>
                <div class="col-span-2 text-center">Đơn giá</div>
                <div class="col-span-2 text-center">Số lượng</div>
                <div class="col-span-2 text-right">Thành tiền</div>
                </div>

                <div class="space-y-6 md:space-y-0">
                <div *ngFor="let item of cartItems()" class="group flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-b border-slate-100 py-4 last:border-0">
         <div class="col-span-6 flex gap-4">
    <div class="w-24 h-24 border border-slate-100 rounded-sm overflow-hidden flex-shrink-0">
        <img [src]="item.image" class="w-full h-full object-cover" [alt]="item.name" onerror="this.src='assets/img/placeholder.png'">
    </div>
    
    <div>
        <p class="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider" *ngIf="item.categoryName">
            {{ item.categoryName }}
        </p>

        <h3 class="text-sm font-bold text-slate-700 mb-1 hover:text-[#D4BEA6] cursor-pointer">
            <a [routerLink]="['/products', item.productId]">{{ item.name }}</a>
        </h3>

        <div class="text-xs text-slate-400 mb-1">
            Mã: {{ item.sku }}
        </div>

        <div *ngIf="item.size" class="text-xs text-slate-500 mb-2 mt-1">
            Kích thước : <span class="font-bold border border-slate-200 px-2 py-0.5 rounded bg-slate-50 text-slate-700">{{ item.size }}</span>
        </div>

        <button (click)="removeItem(item.id)" class="text-xs text-slate-400 hover:text-red-500 underline decoration-slate-300 hover:decoration-red-500 underline-offset-2 transition-colors mt-1">
            Xoá
        </button>
    </div>
</div>

                    <div class="hidden md:block col-span-2 text-center font-medium text-[#D58F83]">
                    {{ item.price | number:'1.0-0' }}₫
                    </div>

                    <div class="col-span-2 flex items-center justify-between md:justify-center mt-3 md:mt-0">
                    <span class="md:hidden text-sm font-medium text-slate-700">Số lượng:</span>
                    <div class="flex items-center border border-slate-200 rounded-sm h-9 w-28">
                        <button (click)="decrement(item)" class="w-9 h-full flex items-center justify-center hover:bg-slate-50 text-slate-500 transition" [disabled]="isProcessing">-</button>
                        <input type="text" [value]="item.quantity" class="w-10 h-full text-center text-sm border-x border-slate-200 focus:outline-none text-slate-700 font-semibold" readonly>
                        <button (click)="increment(item)" class="w-9 h-full flex items-center justify-center hover:bg-slate-50 text-slate-500 transition" [disabled]="isProcessing">+</button>
                    </div>
                    </div>

                    <div class="col-span-2 text-right mt-2 md:mt-0 font-bold text-[#D58F83]">
                    <span class="md:hidden text-slate-500 font-normal mr-2">Tổng:</span>
                    {{ item.totalPrice | number:'1.0-0' }}₫
                    </div>

                </div>
                </div>

                <div class="mt-8">
                <label class="block text-sm font-bold text-slate-700 mb-2">Ghi chú</label>
                <textarea [(ngModel)]="note" rows="4" class="w-full bg-[#F9F9F9] border-none rounded-sm p-4 text-sm focus:ring-1 focus:ring-[#D4BEA6] placeholder-slate-400" placeholder="Vui lòng nhập ghi chú của bạn..."></textarea>
                </div>
            </div>

            <div class="w-full lg:w-[350px] flex-shrink-0">
                <div class="bg-white lg:border lg:border-slate-100 lg:p-6 rounded-sm lg:shadow-sm sticky top-24">
                <h3 class="text-lg font-bold text-slate-700 mb-4 border-b border-slate-100 pb-3">Thông tin đơn hàng</h3>
                
                <div class="flex justify-between items-center mb-3 text-sm">
                    <span class="text-slate-600">Tạm tính ({{ totalCount() }} sản phẩm)</span>
                    <span class="font-bold text-slate-800">{{ totalPrice() | number:'1.0-0' }}₫</span>
                </div>

                <div class="text-xs text-slate-400 mb-6 leading-relaxed">
                    Phí vận chuyển sẽ được tính ở trang thanh toán.
                </div>

                <div class="border-t border-slate-100 my-4"></div>

                <div class="flex justify-between items-end mb-6">
                    <span class="text-base font-bold text-slate-700">Tổng cộng</span>
                    <span class="text-xl font-bold text-[#D58F83]">{{ totalPrice() | number:'1.0-0' }}₫</span>
                </div>

                <div class="flex items-center gap-3 mb-6">
                    <div class="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" [(ngModel)]="isInvoice" id="toggle" class="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-1 top-1 checked:left-5 checked:border-[#D58F83]"/>
                    <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer" [class.bg-rose-400]="isInvoice()"></label>
                    </div>
                    <label for="toggle" class="text-sm text-slate-600 cursor-pointer select-none">Xuất Hóa Đơn</label>
                </div>

                <button routerLink="/checkout" class="w-full py-4 bg-[#D58F83] text-white font-bold uppercase rounded-sm hover:bg-[#c47f73] transition shadow-md hover:shadow-lg tracking-wide">
                    ĐẶT HÀNG
                </button>
                </div>
            </div>
            </div>
        </div>

        <ng-template #emptyCart>
          <div class="text-center py-20">
            <div class="text-6xl mb-4">🛒</div>
            <p class="text-slate-500 mb-6">Giỏ hàng của bạn đang trống</p>
            <a routerLink="/" class="inline-block px-8 py-3 bg-[#D4BEA6] text-white font-bold rounded-full hover:bg-[#B08D6D] transition">Tiếp tục mua sắm</a>
          </div>
        </ng-template>

      </div>
    </div>
  `,
  styles: [`
    .toggle-checkbox:checked { right: 0; border-color: #D58F83; }
    .toggle-checkbox:checked + .toggle-label { background-color: #D58F83; }
  `]
})
// ĐÂY LÀ CLASS CARTPAGE MÀ FILE ROUTES CẦN TÌM
export class CartPage implements OnInit {
  private cartService = inject(CartService);

  cartItems = computed(() => this.cartService.cart()?.items || []);
  totalCount = computed(() => this.cartService.cart()?.totalItemCount || 0);
  totalPrice = computed(() => this.cartService.cart()?.totalCartPrice || 0);

  isLoading = true;
  isProcessing = false;
  note = signal('');
  isInvoice = signal(false);

  ngOnInit(): void {
    this.fetchCart();
  }

  fetchCart() {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: () => this.isLoading = false,
      error: (err: any) => {
        console.error('Lỗi tải giỏ hàng', err);
        this.isLoading = false;
      }
    });
  }

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
    if(confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      this.isProcessing = true;
      this.cartService.removeItem(cartItemId).subscribe({
        next: () => this.isProcessing = false,
        error: () => this.isProcessing = false
      });
    }
  }
}