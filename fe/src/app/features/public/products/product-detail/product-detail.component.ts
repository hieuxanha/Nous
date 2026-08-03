import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // QUAN TRỌNG: Để dùng ngModel cho textarea

// --- SERVICES ---
import { ApiService } from '../../../../core/services/product-detail-service'; 
import { WishlistService } from '../../../../core/services/wishlist.service'; 
import { UserService } from '../../../../core/services/user.service'; 
import { ReviewService } from '../../../../core/services/review.service'; // MỚI

// --- MODELS ---
import { Review, ReviewRequest } from '../../../../core/models/review.model'; // MỚI

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  quantity: number;
  description?: string;
  price: number;
  size?: string;
  image?: string;
  status?: string;
  categoryName: string; 
  categoryId?: number;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-6xl font-sans text-gray-700">

      <div *ngIf="isLoading" class="flex flex-col items-center justify-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mb-4"></div>
        <p class="text-gray-500">Đang tải dữ liệu...</p>
      </div>

      <div *ngIf="errorMsg" class="text-center py-20">
        <p class="text-red-500 text-lg mb-4">{{ errorMsg }}</p>
        <a routerLink="/products" class="text-blue-600 hover:underline">Quay lại danh sách</a>
      </div>

      <div *ngIf="product && !isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        <div class="flex flex-col gap-6">
          <div class="aspect-[4/5] w-full bg-gray-50 rounded-xl overflow-hidden relative border border-gray-100 shadow-sm group">
             <img [src]="currentImage" [alt]="product.name" class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105">
             
             <div *ngIf="product.quantity <= 0" class="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                <span class="text-white font-bold text-xl uppercase tracking-widest border-2 border-white px-6 py-3">Hết hàng</span>
             </div>
          </div>
          
          <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button *ngFor="let img of imageList" (click)="selectImage(img)" 
                    class="w-20 h-24 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer" 
                    [ngClass]="currentImage === img ? 'border-rose-400 opacity-100 ring-2 ring-rose-100' : 'border-gray-100 hover:border-gray-300 opacity-60 hover:opacity-100'">
              <img [src]="img" class="w-full h-full object-cover">
            </button>
          </div>
        </div>

        <div class="flex flex-col">
          <div class="mb-6 border-b border-gray-100 pb-6">
            <span class="text-xs text-rose-500 font-bold uppercase tracking-widest mb-2 block">{{ product.categoryName || 'Danh mục' }}</span>
            <h1 class="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">{{ product.name }}</h1>
            
            <div class="flex items-center gap-6 text-sm">
               <div class="flex items-center gap-1">
                 <span class="text-gray-400">Mã SP:</span>
                 <span class="font-medium text-gray-700">{{ product.sku }}</span>
               </div>
               <div class="w-px h-4 bg-gray-300"></div>
               
               <div class="flex items-center gap-1">
                 <span class="text-gray-400">Kho:</span>
                 <span class="font-medium text-gray-700">{{ product.quantity }}</span>
               </div>
               <div class="w-px h-4 bg-gray-300"></div>

               <span [class]="product.quantity > 0 ? 'text-green-600 font-medium flex items-center gap-1' : 'text-red-500 font-medium flex items-center gap-1'">
                 <span class="w-2 h-2 rounded-full" [ngClass]="product.quantity > 0 ? 'bg-green-600' : 'bg-red-500'"></span>
                 {{ product.quantity > 0 ? 'Còn hàng' : 'Hết hàng' }}
               </span>
            </div>
          </div>

          <div class="text-4xl font-bold text-[#d46b6b] mb-8">{{ product.price | number:'1.0-0' }}₫</div>

          <div class="text-gray-600 mb-8 text-base bg-rose-50/50 p-5 rounded-xl border border-rose-100">
             <div [innerHTML]="product.description" class="line-clamp-3"></div>
          </div>

          <div class="mb-8" *ngIf="sizeList.length > 0">
            <div class="flex justify-between items-end mb-3">
              <span class="font-medium text-gray-900">Kích thước: <span class="font-bold text-rose-500">{{ selectedSize }}</span></span>
              <button class="text-xs text-gray-500 underline hover:text-rose-500 transition-colors">Hướng dẫn chọn size</button>
            </div>
            <div class="flex flex-wrap gap-3">
              <button *ngFor="let size of sizeList" (click)="selectSize(size)" 
                      class="min-w-[50px] h-11 px-4 border rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 relative overflow-hidden group" 
                      [ngClass]="selectedSize === size ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-105' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:text-black'">
                {{ size }}
                <div *ngIf="selectedSize === size" class="absolute inset-0 bg-white/10"></div>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-5 mt-auto">
            <div class="flex items-center gap-4">
               <span class="font-medium text-gray-900">Số lượng mua:</span>
               <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                 <button (click)="updateQuantity(-1)" class="w-10 h-11 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors text-lg">-</button>
                 <input type="text" [value]="quantity" readonly class="w-12 h-11 text-center border-x border-gray-200 focus:outline-none text-gray-900 font-semibold bg-white">
                 <button (click)="updateQuantity(1)" class="w-10 h-11 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors text-lg">+</button>
               </div>
            </div>

            <div class="flex gap-4 h-14">
              <button (click)="addToCart()" [disabled]="product.quantity <= 0" 
                      class="flex-1 bg-[#cc8d8d] hover:bg-[#b57b7b] text-white font-bold rounded-lg uppercase tracking-wide transition-all shadow-md hover:shadow-xl disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed transform active:scale-[0.99] flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {{ product.quantity > 0 ? 'Thêm vào giỏ' : 'Hết hàng' }}
              </button>
              
              <button (click)="toggleFavorite()" 
                      class="w-14 border-2 rounded-lg flex items-center justify-center transition-all duration-300 group hover:shadow-md" 
                      [ngClass]="isFavorite ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-400'">
                <svg xmlns="http://www.w3.org/2000/svg" [ngClass]="isFavorite ? 'fill-current' : 'fill-none'" class="h-7 w-7 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
          </div>

          <div class="mt-12">
             <div class="flex gap-8 border-b border-gray-200 mb-6">
                <button (click)="switchTab('desc')" class="pb-3 text-lg font-medium transition-all border-b-2 relative" [ngClass]="activeTab === 'desc' ? 'border-rose-400 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'">Mô tả sản phẩm</button>
                <button (click)="switchTab('specs')" class="pb-3 text-lg font-medium transition-all border-b-2 relative" [ngClass]="activeTab === 'specs' ? 'border-rose-400 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'">Thông số</button>
             </div>
             <div class="text-gray-600 leading-relaxed text-sm min-h-[100px]">
                <div *ngIf="activeTab === 'desc'" class="prose prose-sm max-w-none"><div [innerHTML]="product.description"></div></div>
                <div *ngIf="activeTab === 'specs'" class="flex flex-col gap-2 text-gray-500">
                  <p>Mã sản phẩm: {{product.sku}}</p>
                  <p>Kho: {{product.categoryName}}</p>
                  <p>Tình trạng: Mới 100%</p>
                </div>
             </div>
          </div>
        </div> 
      </div>

      <div *ngIf="product && !isLoading" class="border-t border-gray-200 pt-16 mt-16">
        <h2 class="text-3xl font-bold text-center text-gray-700 mb-12">Đánh giá sản phẩm</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gray-50 rounded-xl p-8 border border-gray-100 mb-10">
          
          <div class="md:col-span-3 flex flex-col items-center justify-center border-r border-gray-200 pr-4">
             <div class="flex items-center gap-2 mb-2">
                <span class="text-5xl font-bold text-gray-800">{{ reviewStats.average }}</span>
                <span class="text-yellow-400 text-2xl">★</span>
             </div>
             <span class="text-gray-500 text-sm">{{ reviewStats.total }} đánh giá</span>
          </div>

          <div class="md:col-span-5 flex flex-col gap-3 px-4">
             <div *ngFor="let item of reviewStats.breakdown" class="flex items-center gap-3 text-sm">
                <div class="flex text-yellow-400 w-16 font-medium">{{ item.star }} ★</div>
                <div class="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                   <div class="h-full bg-yellow-400 rounded-full transition-all duration-500" [style.width.%]="item.percent"></div>
                </div>
                <span class="text-gray-600 font-medium w-8 text-right">{{ item.count }}</span>
             </div>
          </div>

          <div class="md:col-span-4 flex flex-col pl-4 border-l border-gray-200">
             <p class="text-gray-600 font-medium mb-4 text-center">Chia sẻ nhận xét của bạn</p>
             
             <div *ngIf="isLoggedIn; else loginPrompt" class="w-full">
                <div class="flex justify-center gap-2 mb-4">
                    <button *ngFor="let star of [1,2,3,4,5]" 
                            (click)="newReview.rating = star"
                            class="text-2xl transition-colors"
                            [ngClass]="star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'">
                       ★
                    </button>
                </div>
                
                <textarea [(ngModel)]="newReview.content" 
                          class="w-full p-3 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:border-slate-500"
                          rows="3" 
                          placeholder="Viết đánh giá của bạn..."></textarea>

                <button (click)="submitReview()" 
                        [disabled]="isSubmitting"
                        class="w-full bg-slate-800 text-white py-2.5 rounded hover:bg-black transition-colors text-sm font-medium uppercase tracking-wide disabled:opacity-50">
                    {{ isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá' }}
                </button>
             </div>

             <ng-template #loginPrompt>
                 <div class="text-center">
                    <p class="text-xs text-gray-500 mb-2">Bạn cần đăng nhập để đánh giá</p>
                    <a routerLink="/login" class="text-xs text-blue-600 font-semibold hover:underline">Đăng nhập ngay</a>
                 </div>
             </ng-template>
          </div>
        </div>

        <div class="mt-8 space-y-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">Bình luận mới nhất</h3>

            <div *ngFor="let review of reviews" class="flex gap-4 border-b border-gray-100 pb-6 last:border-0 animate-fade-in">
                <div class="w-12 h-12 rounded-full bg-[#cc8d8d] text-white flex items-center justify-center text-lg font-bold shadow-sm flex-shrink-0">
                    {{ review.avatarChar }}
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="font-bold text-gray-800 text-sm">{{ review.userName }}</h4>
                            <div class="flex text-yellow-400 text-xs mt-1">
                                <ng-container *ngFor="let star of [1,2,3,4,5]">
                                    <span *ngIf="star <= review.rating">★</span>
                                    <span *ngIf="star > review.rating" class="text-gray-300">★</span>
                                </ng-container>
                            </div>
                        </div>
                        <span class="text-xs text-gray-400">{{ review.date }}</span>
                    </div>
                    <p class="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">{{ review.content }}</p>
                </div>
            </div>

            <div *ngIf="reviews.length === 0" class="text-center py-10 text-gray-400 italic bg-gray-50 rounded-lg">
                Chưa có đánh giá nào. Hãy là người đầu tiên!
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
export class ProductDetailComponent implements OnInit {
  // Inject Services
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private wishlistService = inject(WishlistService);
  private userService = inject(UserService);
  private reviewService = inject(ReviewService);

  // Variables
  product: any = null;
  isLoading = true;
  errorMsg = '';
  
  reviews: Review[] = []; 
  newReview = { rating: 5, content: '' };
  
  isSubmitting = false;
  isLoggedIn = false;
  isFavorite = false;

  currentImage = '';
  imageList: string[] = [];
  sizeList: string[] = [];
  selectedSize = '';
  quantity = 1;
  activeTab: 'desc' | 'specs' = 'desc';

  // Stats Default
  reviewStats = {
    average: 0,
    total: 0,
    breakdown: [
        { star: 5, count: 0, percent: 0 },
        { star: 4, count: 0, percent: 0 },
        { star: 3, count: 0, percent: 0 },
        { star: 2, count: 0, percent: 0 },
        { star: 1, count: 0, percent: 0 }
    ]
  };

  ngOnInit(): void {
    // Check Login
    const user = this.userService.currentUser();
    this.isLoggedIn = !!(user && user.id);

    // Load Product
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.fetchProduct(productId);
      this.fetchReviews(Number(productId)); // Gọi API Review
    } else {
      this.handleError('Không tìm thấy ID sản phẩm');
    }
  }

  // 1. FETCH PRODUCT
  fetchProduct(id: string): void {
    this.isLoading = true;
    this.apiService.getProductById(id).subscribe({
      next: (data: any) => {
        this.product = data;
        this.processProductData(data);
        this.isLoading = false;
        this.checkFavoriteStatus(Number(id));
      },
      error: (err) => this.handleError('Lỗi kết nối Server', err)
    });
  }

  // 2. FETCH REVIEWS
  fetchReviews(productId: number) {
      this.reviewService.getReviewsByProduct(productId).subscribe({
          next: (data) => {
              this.reviews = data;
              this.calculateStats(); // Tính toán thống kê
          },
          error: () => console.log('Chưa có đánh giá nào')
      });
  }

  // 3. SUBMIT REVIEW
  submitReview() {
      if (!this.newReview.content.trim()) {
          alert('Vui lòng nhập nội dung đánh giá!');
          return;
      }

      this.isSubmitting = true;
      
      const user = this.userService.currentUser();
      if(!user || !user.id) {
          alert('Vui lòng đăng nhập lại!');
          return;
      }

      const request: ReviewRequest = {
          userId: user.id,
          productId: this.product.id,
          rating: this.newReview.rating,
          content: this.newReview.content
      };

      this.reviewService.addReview(request).subscribe({
          next: (savedReview) => {
              this.reviews.unshift(savedReview); // Thêm review mới lên đầu
              this.calculateStats(); // Tính lại điểm
              
              // Reset form
              this.newReview = { rating: 5, content: '' };
              this.isSubmitting = false;
              alert('Cảm ơn đánh giá của bạn!');
          },
          error: (err) => {
              console.error(err);
              this.isSubmitting = false;
              alert('Gửi đánh giá thất bại. Vui lòng thử lại.');
          }
      });
  }

  // 4. CALCULATE STATS (Tự động tính toán)
  calculateStats() {
      const total = this.reviews.length;
      if (total === 0) {
          this.reviewStats = { average: 0, total: 0, breakdown: this.createEmptyBreakdown() };
          return;
      }

      let sum = 0;
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      this.reviews.forEach(r => {
          sum += r.rating;
          if (r.rating >= 1 && r.rating <= 5) {
              (counts as any)[r.rating]++;
          }
      });

      this.reviewStats.total = total;
      this.reviewStats.average = parseFloat((sum / total).toFixed(1));
      
      this.reviewStats.breakdown = [
          { star: 5, count: counts[5], percent: (counts[5] / total) * 100 },
          { star: 4, count: counts[4], percent: (counts[4] / total) * 100 },
          { star: 3, count: counts[3], percent: (counts[3] / total) * 100 },
          { star: 2, count: counts[2], percent: (counts[2] / total) * 100 },
          { star: 1, count: counts[1], percent: (counts[1] / total) * 100 }
      ];
  }

  createEmptyBreakdown() {
      return [
        { star: 5, count: 0, percent: 0 },
        { star: 4, count: 0, percent: 0 },
        { star: 3, count: 0, percent: 0 },
        { star: 2, count: 0, percent: 0 },
        { star: 1, count: 0, percent: 0 }
      ];
  }

  // --- LOGIC CŨ (Giữ nguyên) ---
  checkFavoriteStatus(productId: number) {
    const user = this.userService.currentUser();
    if (user && user.id) {
        this.wishlistService.checkFavorite(user.id, productId).subscribe({
            next: (res: any) => this.isFavorite = res.isFavorite,
            error: () => this.isFavorite = false
        });
    }
  }

  addToCart(): void {
    if (!this.validateAddToCart()) return;
    const payload = {
      productId: this.product.id,
      quantity: this.quantity,
      size: this.selectedSize,
      price: this.product.price,
      sku: this.product.sku
    };
    this.apiService.addToCart(payload).subscribe({
      next: () => alert(`Đã thêm ${this.quantity} sản phẩm vào giỏ hàng!`),
      error: (err) => { console.error(err); alert('Lỗi khi thêm vào giỏ hàng.'); }
    });
  }

  toggleFavorite(): void {
    const user = this.userService.currentUser();
    if (!user || !user.id) {
        alert("Vui lòng đăng nhập!");
        return;
    }
    this.wishlistService.toggleWishlist(user.id, this.product.id).subscribe({
        next: (res: any) => {
            this.isFavorite = res.status; 
            if(this.isFavorite) alert("Đã thêm vào danh sách yêu thích ❤️");
            else console.log("Đã bỏ yêu thích");
        },
        error: (err: any) => { console.error(err); alert("Lỗi cập nhật yêu thích"); }
    });
  }

  private processProductData(product: any): void {
    this.currentImage = product.image || 'https://placehold.co/600x400';
    this.imageList = [this.currentImage];
    if (product.size) {
      this.sizeList = product.size.split(',').map((s: string) => s.trim());
      this.selectedSize = this.sizeList[0];
    }
  }

  private validateAddToCart(): boolean {
    if (!this.product || this.product.quantity <= 0) {
      alert('Sản phẩm đã hết hàng!');
      return false;
    }
    if (this.sizeList.length > 0 && !this.selectedSize) {
      alert('Vui lòng chọn kích thước!');
      return false;
    }
    return true;
  }

  private handleError(msg: string, err?: any): void {
    console.error(msg, err);
    this.errorMsg = msg;
    this.isLoading = false;
  }

  selectImage(img: string) { this.currentImage = img; }
  selectSize(size: string) { this.selectedSize = size; }
  updateQuantity(change: number) { this.quantity = Math.max(1, this.quantity + change); }
  switchTab(tab: 'desc' | 'specs') { this.activeTab = tab; }
}