import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router'; // Thêm ActivatedRoute
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { Product } from '../../../core/models/product2.model';
import { ProductService } from '../../../core/services/product2.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  template: `
    <section class="py-16 bg-[#FAFAFA] relative">
      <div class="w-full max-w-[1280px] mx-auto px-4 md:px-6 lg:px-4">
        
        <div class="text-center mb-12">
          <h3 class="text-2xl md:text-3xl font-bold text-slate-700 uppercase tracking-wide">
            {{ categoryName || 'Danh mục sản phẩm' }}
          </h3>
          <div class="w-16 h-1 bg-[#C8B096] mx-auto mt-4"></div>
        </div>

        <div *ngIf="isLoading" class="flex justify-center py-10">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C8B096]"></div>
        </div>
        <div *ngIf="errorMessage" class="text-center text-red-500 py-10">
            {{ errorMessage }}
        </div>

        <div *ngIf="!isLoading && !errorMessage && products.length === 0" class="text-center py-10 text-slate-500">
            Chưa có sản phẩm nào trong danh mục này.
        </div>

        <div *ngIf="!isLoading && !errorMessage && products.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 relative z-10">
          
          <div *ngFor="let product of products" class="group relative flex flex-col items-center bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
            <div class="relative w-full aspect-square bg-gray-100 mb-3 overflow-hidden rounded-md">
              <div *ngIf="product.isNew" class="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase">New</div>
              <div *ngIf="product.isSoldOut" class="absolute top-2 left-2 z-10 bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase">Hết</div>
              <img [src]="product.image" [alt]="product.name" class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" onerror="this.src='assets/img/placeholder.png'"> 
              
              <button 
                (click)="openQuickView($event, product)"
                class="absolute top-2 right-2 z-10 w-8 h-8 bg-white text-slate-600 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#C8B096] hover:text-white cursor-pointer"
                title="Xem nhanh & Thêm vào giỏ"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
              </button>
            </div>
            <div class="text-center w-full px-1">
              <a [routerLink]="['/products', product.id]" class="block text-slate-700 text-sm font-medium mb-1 hover:text-[#C8B096] line-clamp-2 min-h-[40px]">{{ product.name }}</a>
              <p class="text-[#D45555] font-bold text-sm md:text-base mt-1">{{ product.price | number:'1.0-0' }}₫</p>
            </div>
          </div>
        </div>

      </div>

      <div *ngIf="selectedProduct" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 transition-opacity" (click)="closeQuickView()"></div>

          <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden animate-fade-in-up">
              
              <button (click)="closeQuickView()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div class="flex flex-col md:flex-row">
                  <div class="w-full md:w-1/2 bg-gray-100 p-4 flex items-center justify-center">
                      <img [src]="selectedProduct.image" [alt]="selectedProduct.name" class="max-w-full max-h-[400px] object-contain" onerror="this.src='assets/img/placeholder.png'">
                  </div>

                  <div class="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                      <h2 class="text-xl md:text-2xl font-bold text-slate-800 mb-2">{{ selectedProduct.name }}</h2>
                      <div class="text-sm text-slate-500 mb-4 space-y-1">
                          <p>Mã sản phẩm: <span class="font-medium text-slate-700">{{ selectedProduct.sku }}</span></p>
                      </div>
                      <div class="text-2xl font-bold text-[#D58F83] mb-6">{{ selectedProduct.price | number:'1.0-0' }}₫</div>

                      <div class="mb-6">
                          <h3 class="text-sm font-bold text-slate-700 mb-3">Kích thước:</h3>
                          <div class="flex flex-wrap gap-2">
                              <button *ngFor="let size of availableSizes" (click)="selectedSize.set(size)" class="w-10 h-10 rounded-full border flex items-center justify-center text-sm font-medium transition-all" [ngClass]="selectedSize() === size ? 'border-[#C8B096] bg-[#C8B096] text-white' : 'border-slate-200 text-slate-600 hover:border-[#C8B096]'">
                                  {{ size }}
                              </button>
                          </div>
                          <p *ngIf="showSizeError" class="text-red-500 text-xs mt-2 animate-bounce">Vui lòng chọn kích thước!</p>
                      </div>

                      <div class="mb-8 flex items-center gap-4">
                          <h3 class="text-sm font-bold text-slate-700">Số lượng:</h3>
                          <div class="flex items-center border border-slate-200 rounded-sm h-9 w-28">
                              <button (click)="decrementQuantity()" class="w-9 h-full flex items-center justify-center hover:bg-slate-50 text-slate-500 transition" [disabled]="quantity() <= 1">-</button>
                              <input type="text" [ngModel]="quantity()" class="w-10 h-full text-center text-sm border-x border-slate-200 focus:outline-none text-slate-700 font-semibold" readonly>
                              <button (click)="incrementQuantity()" class="w-9 h-full flex items-center justify-center hover:bg-slate-50 text-slate-500 transition">+</button>
                          </div>
                      </div>

                      <button (click)="addToCartFromPopup()" class="w-full py-3 bg-[#D58F83] text-white font-bold uppercase rounded-sm hover:bg-[#c47f73] transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2" [disabled]="isAddingToCart">
                          <span *ngIf="!isAddingToCart">THÊM VÀO GIỎ HÀNG</span>
                          <span *ngIf="isAddingToCart" class="flex items-center gap-2">
                              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              Đang thêm...
                          </span>
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
  `]
})
export class CategoryProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  errorMessage = '';
  categoryName = '';
  
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute); // Inject Router để lấy ID

  // --- State cho Popup ---
  selectedProduct: Product | null = null;
  quantity = signal(1);
  selectedSize = signal<string | null>(null);
  availableSizes: string[] = []; 
  isAddingToCart = false;
  showSizeError = false;

  ngOnInit(): void {
    // Lắng nghe sự thay đổi của tham số ID trên URL
    // Ví dụ: khi chuyển từ /category/1 sang /category/2, code này sẽ tự chạy lại
    this.route.paramMap.subscribe(params => {
        const id = Number(params.get('id')); // Lấy ID từ URL
        if (id) {
            this.fetchProductsByCategory(id);
            this.fetchCategoryName(id); // (Tuỳ chọn) Lấy tên danh mục
        }
    });
  }

  fetchProductsByCategory(id: number) {
    this.isLoading = true;
    this.products = []; // Clear sản phẩm cũ
    
    this.productService.getProductsByCategory(id).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải sản phẩm theo danh mục:', err);
        this.errorMessage = 'Không thể tải sản phẩm của danh mục này.';
        this.isLoading = false;
      }
    });
  }

  // Tuỳ chọn: Lấy tên danh mục để hiển thị tiêu đề
  fetchCategoryName(id: number) {
      this.productService.getCategoryDetail(id).subscribe({
          next: (data) => {
              this.categoryName = data.name; // Giả sử API trả về object có thuộc tính name
          },
          error: () => this.categoryName = 'Danh mục sản phẩm'
      });
  }

  // --- Logic Popup (Giữ nguyên y hệt code cũ của bạn) ---

  openQuickView(event: Event, product: Product) {
    event.stopPropagation(); 
    event.preventDefault();
    
    this.selectedProduct = product;
    this.quantity.set(1);
    this.selectedSize.set(null);
    this.showSizeError = false;

    if (product.size) {
        this.availableSizes = product.size.split(',').map((s: string) => s.trim());
        if (this.availableSizes.length > 0) {
             this.selectedSize.set(this.availableSizes[0]);
        }
    } else {
        this.availableSizes = [];
    }
  }

  closeQuickView() {
    this.selectedProduct = null;
  }

  incrementQuantity() {
    this.quantity.update(q => q + 1);
  }

  decrementQuantity() {
    this.quantity.update(q => q > 1 ? q - 1 : 1);
  }

  addToCartFromPopup() {
    if (!this.selectedProduct) return;

    if (this.availableSizes.length > 0 && !this.selectedSize()) {
        this.showSizeError = true;
        return;
    }

    this.isAddingToCart = true;
    this.showSizeError = false;

    const payload = {
        productId: this.selectedProduct.id,
        quantity: this.quantity(),
        size: this.selectedSize() || '' 
    };

    this.cartService.addToCart(payload).subscribe({
      next: () => {
        this.isAddingToCart = false;
        this.closeQuickView(); 
      },
      error: (err) => {
        console.error('Lỗi thêm giỏ hàng:', err);
        this.isAddingToCart = false;
      }
    });
  }
}