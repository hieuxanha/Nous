import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, catchError } from 'rxjs';

import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CategoryService } from '../../../core/services/category.service';
import { ProductService } from '../../../core/services/product2.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <header class="bg-white font-sans text-slate-700 sticky top-0 z-50 shadow-sm relative">
      <div class="container mx-auto px-4 lg:px-10 py-4 flex items-center justify-center gap-4">
        
        <a routerLink="/" class="flex-shrink-0">
          <img src="assets/img/nous-logo.png" alt="Nous" class="h-10 object-contain hidden md:block" onerror="this.style.display='none'">
          <span class="text-3xl font-light text-[#D4BEA6] md:hidden block">noûs</span>
        </a>

        <div class="hidden md:flex flex-1 max-w-xl mx-8 relative group">
          
          <input type="text" 
                 [(ngModel)]="searchQuery" 
                 (input)="onSearchInput()" 
                 (keyup.enter)="onSearch()" 
                 (focus)="isSearchFocused = true"
                 (blur)="onBlurSearch()"
                 placeholder="Tìm kiếm sản phẩm..." 
                 class="w-full bg-[#F5F5F5] text-sm px-4 py-2.5 outline-none rounded-sm transition focus:ring-1 focus:ring-[#D4BEA6] relative z-20"
                 [class.rounded-b-none]="isSearchFocused && searchSuggestions.length > 0">

          <button (click)="onSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <div *ngIf="isSearchFocused && searchSuggestions.length > 0" 
               class="absolute top-full left-0 w-full bg-white border border-t-0 border-slate-200 shadow-lg rounded-b-md z-10 overflow-hidden animate-fade-in">
            <ul>
              <li class="px-4 py-2 text-xs text-slate-400 bg-slate-50 font-semibold uppercase">Gợi ý sản phẩm</li>
              
              <li *ngFor="let product of searchSuggestions" 
                  (mousedown)="selectSuggestion(product.name)"
                  class="px-4 py-3 text-sm text-slate-600 hover:bg-[#FFFBF3] hover:text-[#B08D6D] cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0">
                  
                  <img [src]="product.image" class="w-8 h-8 object-cover rounded-sm border border-gray-100" onerror="this.src='assets/img/placeholder.png'">
                  
                  <div class="flex flex-col">
                      <span class="font-medium truncate max-w-[300px]">{{ product.name }}</span>
                      <span class="text-xs text-[#D4BEA6]">{{ product.price | number }}₫</span>
                  </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex items-center gap-4 lg:gap-6 text-[13px] font-medium">
            <button (click)="toggleSearch()" class="md:hidden text-slate-600 hover:text-[#B08D6D] transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>

            <a *ngIf="!authService.currentUser()" routerLink="/login" class="flex items-center gap-1 hover:text-[#B08D6D] transition cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="hidden lg:inline">Tài khoản</span>
            </a>

             <div *ngIf="authService.currentUser() as user" class="relative group cursor-pointer z-50">
                <div class="flex items-center gap-2 hover:text-[#B08D6D] transition py-1">
                    <div class="w-7 h-7 rounded-full bg-[#D4BEA6] text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm border border-white ring-1 ring-gray-100">
                        {{ user.fullName.charAt(0) || 'U' }}
                    </div>
                    <span class="hidden lg:inline font-semibold max-w-[120px] truncate">{{ user.fullName }}</span>
                </div>
                <div class="absolute right-0 top-[90%] mt-0 w-48 bg-white shadow-xl rounded-md border border-gray-100 hidden group-hover:block z-[100] overflow-hidden animate-fade-in">
                    <div class="px-4 py-3 border-b border-gray-50 bg-gray-50">
                        <p class="text-xs text-gray-500">Xin chào,</p>
                        <p class="text-sm font-bold text-slate-700 truncate">{{ user.fullName }}</p>
                    </div>
                    <a routerLink="/account" class="block px-4 py-2 text-sm text-gray-600 hover:bg-[#FFFBF3] hover:text-[#B08D6D] transition-colors">Thông tin tài khoản</a>
                    <a routerLink="/account/orders" class="block px-4 py-2 text-sm text-gray-600 hover:bg-[#FFFBF3] hover:text-[#B08D6D] transition-colors">Đơn hàng của tôi</a>
                    <div class="border-t border-gray-100 my-1"></div>
                    <button (click)="handleLogout()" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-medium transition-colors">Đăng xuất</button>
                </div>
            </div>

            <a routerLink="/wishlist" class="flex items-center gap-1 hover:text-[#B08D6D] transition relative">
                <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span *ngIf="wishlistService.wishlistCount() > 0" class="absolute -top-1 -right-1 bg-[#787878] text-white text-[10px] h-3.5 w-3.5 flex items-center justify-center rounded-full">{{ wishlistService.wishlistCount() }}</span>
                </div>
                <span class="hidden lg:inline">Yêu thích</span>
            </a>

             <button (click)="cartService.open()" class="flex items-center gap-2 px-3 py-1.5 rounded border border-[#E8DCC8] bg-[#FFFBF3] text-[#5A5A5A] hover:border-[#D4BEA6] transition cursor-pointer">
                <span class="hidden lg:inline">Giỏ hàng</span>
                <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span *ngIf="cartService.cartCount() > 0" class="absolute -top-2 -right-2 bg-[#5A5A5A] text-white text-[10px] h-4 w-4 flex items-center justify-center rounded-full animate-bounce">{{ cartService.cartCount() }}</span>
                <span *ngIf="cartService.cartCount() === 0" class="absolute -top-2 -right-2 bg-[#5A5A5A] text-white text-[10px] h-4 w-4 flex items-center justify-center rounded-full">0</span>
                </div>
            </button>
        </div>
      </div>
      
      <div class="md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-100 bg-white" [class.max-h-0]="!isSearchOpen" [class.max-h-20]="isSearchOpen" [class.opacity-0]="!isSearchOpen" [class.opacity-100]="isSearchOpen">
           <div class="p-4"><div class="relative"><input type="text" [(ngModel)]="searchQuery" (keyup.enter)="onSearch()" placeholder="Tìm kiếm sản phẩm..." class="w-full bg-[#F5F5F5] text-sm px-4 py-2.5 outline-none rounded-md focus:ring-1 focus:ring-[#D4BEA6]"><button (click)="onSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#B08D6D]"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button></div></div>
      </div>

      <nav class="hidden lg:block border-t border-slate-100">
        <div class="container mx-auto px-4 flex justify-center">
          <ul class="flex items-center">
            <li *ngFor="let item of menuItems" class="group relative">
              <a [routerLink]="item.path" routerLinkActive="text-[#B08D6D]" [routerLinkActiveOptions]="{exact: item.exact}" class="block px-5 py-4 text-[13px] font-semibold uppercase text-slate-600 hover:text-[#B08D6D] tracking-wide flex items-center gap-1 transition-colors">
                {{ item.label }}
                <svg *ngIf="item.hasSub" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-slate-400 group-hover:text-[#B08D6D]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </a>
              <span class="absolute bottom-0 left-0 w-full h-[2px] bg-[#B08D6D] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </li>
          </ul>
        </div>
      </nav>

      <div class="lg:hidden border-t px-4 py-2 flex items-center justify-between bg-slate-50">
        <span class="text-xs text-slate-500 uppercase font-semibold">Menu</span>
        <button class="p-2 text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg></button>
      </div>
    </header>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
  `]
})
export class HeaderComponent implements OnInit {
  public wishlistService = inject(WishlistService);
  public cartService = inject(CartService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  isSearchOpen = false;
  searchQuery = '';
  isSearchFocused = false;
  
  searchSuggestions: any[] = []; 
  
  // Subject để xử lý stream dữ liệu nhập vào
  private searchSubject = new Subject<string>();

  menuItems: any[] = [{ label: 'Giới thiệu Nous', path: '/about', exact: true, hasSub: false }];

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user && user.id) this.wishlistService.getWishlist(user.id).subscribe(); 
    this.fetchCategories();

    // --- CẤU HÌNH LIVE SEARCH NHẠY HƠN ---
    this.searchSubject.pipe(
      debounceTime(100), // Giảm xuống 100ms -> Gõ là thấy gợi ý liền
      distinctUntilChanged(),
      switchMap((query) => {
          if (!query || query.trim() === '') {
              return of([]);
          }
          // Gọi API tìm kiếm
          return this.productService.searchProducts(query).pipe(
              catchError(() => of([]))
          );
      })
    ).subscribe((results) => {
        this.searchSuggestions = results;
    });
  }

  fetchCategories() {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        const apiMenuItems = categories.map(cat => ({
          label: cat.name,
          path: `/category/${cat.id}`,
          exact: false,
          hasSub: false
        }));
        this.menuItems = [...this.menuItems, ...apiMenuItems];
      },
      error: (err) => console.error(err)
    });
  }

  // Sự kiện input sẽ kích hoạt ngay khi gõ phím
  onSearchInput() {
      this.searchSubject.next(this.searchQuery);
  }

  toggleSearch() { this.isSearchOpen = !this.isSearchOpen; }

  selectSuggestion(productName: string) {
    this.searchQuery = productName;
    this.onSearch();
  }

  onBlurSearch() {
    setTimeout(() => { this.isSearchFocused = false; }, 200);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
      this.isSearchOpen = false;
      this.isSearchFocused = false;
    }
  }
  
  handleLogout() {
    this.authService.logout();
    this.wishlistService.clearWishlist();
    this.router.navigate(['/login']);
  }
}