import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// 1. IMPORT CÁC SERVICE CẦN THIẾT
import { WishlistService } from '../../../core/services/wishlist.service';
import { UserService } from '../../../core/services/user.service';
import { CartService } from '../../../core/services/cart.service'; // <--- DÙNG CÁI NÀY THAY API SERVICE

// 2. Import Model
import { WishlistItem } from '../../../core/models/wishlist.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-10 font-sans">
      <div class="container mx-auto max-w-6xl px-4">

        <div class="bg-[#dcbfa8] rounded-t-lg px-6 py-4 flex justify-between items-center relative shadow-sm">
          <h2 class="text-xl md:text-2xl text-gray-700 font-medium tracking-wide">Danh mục sản phẩm yêu thích</h2>
          
          <button (click)="goBack()" class="text-gray-600 hover:text-black transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="bg-white min-h-[400px] border-x border-b border-gray-200 rounded-b-lg p-6 md:p-10">
          
          <div *ngIf="isLoading" class="text-center py-20 text-gray-500">
             <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#cc8d8d] mx-auto mb-2"></div>
             Đang tải dữ liệu...
          </div>

          <div *ngIf="!isLoading && wishlistItems.length === 0" class="text-center py-20 text-gray-500">
            <p class="mb-4 text-lg">Bạn chưa có sản phẩm yêu thích nào.</p>
            <a routerLink="/" class="text-white bg-[#cc8d8d] px-6 py-2 rounded-full hover:bg-[#b57b7b] transition shadow-md inline-block">
                Đi mua sắm ngay
            </a>
          </div>

          <div *ngIf="!isLoading && wishlistItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div *ngFor="let item of wishlistItems" class="border border-gray-200 rounded-xl p-4 flex gap-4 bg-white hover:shadow-lg transition-shadow relative group">
              
              <div class="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer" [routerLink]="['/product', item.productId]">
                <img [src]="item.image || 'https://placehold.co/200x200?text=No+Image'" 
                     [alt]="item.productName" 
                     class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              </div>

              <div class="flex flex-col justify-between flex-1 py-1">
                <div>
                  <h3 class="text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed">
                    <a [routerLink]="['/product', item.productId]" class="hover:text-[#cc8d8d] transition-colors">
                      {{ item.productName }}
                    </a>
                  </h3>
                </div>

                <div class="mt-2">
                  <span class="text-[#d46b6b] font-bold text-lg">{{ item.price | number:'1.0-0' }}₫</span>
                </div>

                <div class="flex items-center gap-3 mt-3">
                  
                  <button (click)="addToCart(item)" title="Thêm vào giỏ" class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-[#cc8d8d] hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5c.07.286.074.58.074.876 0 2.409-1.333 3.876-3.876 3.876h-8c-2.543 0-3.876-1.467-3.876-3.876 0-.296.004-.59.074-.876l1.263-5c.236-.94 1.084-1.633 2.05-1.633h10.434c.966 0 1.814.693 2.05 1.633z" />
                    </svg>
                  </button>

                  <button (click)="removeItem(item.productId)" title="Xóa" class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white transition-all ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>

                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>
    </div>
  `
})
export class WishlistComponent implements OnInit {
  
  wishlistItems: WishlistItem[] = [];
  isLoading: boolean = false;

  constructor(
    private wishlistService: WishlistService, // Service Yêu thích
    private cartService: CartService,         // Service Giỏ hàng (Đã thay thế ApiService)
    private userService: UserService,         // Service User
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlistData();
  }

  // 1. Load Wishlist
  loadWishlistData() {
    const user = this.userService.currentUser();
    if (!user || !user.id) {
        this.wishlistItems = [];
        return;
    }

    this.isLoading = true;
    this.wishlistService.getWishlist(user.id).subscribe({
      next: (data: WishlistItem[]) => {
        this.wishlistItems = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // 2. Xóa Wishlist
  removeItem(productId: number) {
    const user = this.userService.currentUser();
    if (!user || !user.id) return;

    if(confirm('Xóa sản phẩm này khỏi yêu thích?')) {
      this.wishlistService.toggleWishlist(user.id, productId).subscribe({
        next: () => this.loadWishlistData(),
        error: (err: any) => alert('Lỗi: ' + err.message)
      });
    }
  }

  // 3. Thêm vào giỏ hàng (GỌI CART SERVICE)
  addToCart(item: WishlistItem) {
    const user = this.userService.currentUser();
    if (!user) {
        alert("Vui lòng đăng nhập!");
        return;
    }

    const payload = {
        userId: user.id,
        productId: item.productId,
        quantity: 1,     
        size: ''         
    };

    // Dùng CartService để gọi API
    this.cartService.addToCart(payload).subscribe({
        next: () => alert(`Đã thêm "${item.productName}" vào giỏ hàng!`),
        error: (err: any) => {
            console.error(err);
            alert('Lỗi thêm giỏ hàng.');
        }
    });
  }

  goBack() {
    this.router.navigate(['/']); 
  }
}