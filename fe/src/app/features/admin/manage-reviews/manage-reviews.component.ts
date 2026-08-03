import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-manage-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-slate-200">
      
      <div class="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Quản lý đánh giá</h2>
          <p class="text-sm text-slate-500 mt-1">Xem và kiểm duyệt các đánh giá từ khách hàng</p>
        </div>
        <div class="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
          Tổng: {{ reviews().length }}
        </div>
      </div>

      <div *ngIf="isLoading" class="p-8 text-center text-slate-500">
        Đang tải dữ liệu...
      </div>

      <div *ngIf="!isLoading" class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th class="px-6 py-4">Sản phẩm</th>
              <th class="px-6 py-4">Khách hàng</th>
              <th class="px-6 py-4">Đánh giá</th>
              <th class="px-6 py-4">Nội dung</th>
              <th class="px-6 py-4">Trạng thái</th>
              <th class="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            
            <tr *ngFor="let review of reviews()" class="hover:bg-slate-50 transition" [class.opacity-50]="!review.isVisible">
              
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img [src]="review.productImage || 'assets/img/placeholder.png'" class="w-10 h-10 rounded object-cover border border-slate-200">
                  <div class="max-w-[150px]">
                    <div class="font-medium text-slate-700 truncate" [title]="review.productName">{{ review.productName }}</div>
                    <div class="text-xs text-slate-400">ID: {{ review.productId }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="font-medium text-slate-700">{{ review.userName }}</div>
                <div class="text-xs text-slate-400">{{ review.date }}</div>
              </td>

              <td class="px-6 py-4">
                <div class="flex text-yellow-400 text-xs">
                  <ng-container *ngFor="let star of [1,2,3,4,5]">
                     <span *ngIf="star <= review.rating">★</span>
                     <span *ngIf="star > review.rating" class="text-gray-300">★</span>
                  </ng-container>
                </div>
                <span class="text-xs font-bold ml-1 text-slate-500">{{ review.rating }}/5</span>
              </td>

              <td class="px-6 py-4">
                <p class="line-clamp-2 max-w-xs text-slate-600" [title]="review.content">
                  {{ review.content }}
                </p>
              </td>

              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-xs font-bold"
                      [ngClass]="review.isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'">
                  {{ review.isVisible ? 'Hiển thị' : 'Đã ẩn' }}
                </span>
              </td>

              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  
                  <button (click)="toggleVisibility(review)" 
                          class="p-2 rounded-full transition hover:bg-slate-100"
                          [title]="review.isVisible ? 'Ẩn đánh giá này' : 'Hiện đánh giá này'">
                    <svg *ngIf="review.isVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg *ngIf="!review.isVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>

                  <button (click)="deleteReview(review.id)" 
                          class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition"
                          title="Xóa vĩnh viễn">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                </div>
              </td>
            </tr>

            <tr *ngIf="reviews().length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-slate-400 italic">
                Chưa có đánh giá nào.
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ManageReviewsComponent implements OnInit {
  // [SỬA] Khai báo kiểu rõ ràng cho reviewService để tránh lỗi "unknown"
  private reviewService: ReviewService = inject(ReviewService);
  
  reviews = signal<Review[]>([]);
  isLoading = true;

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.isLoading = true;
    this.reviewService.getAllReviews().subscribe({
      // [SỬA] Thêm kiểu ': Review[]' cho data
      next: (data: Review[]) => {
        this.reviews.set(data);
        this.isLoading = false;
      },
      // [SỬA] Thêm kiểu ': any' cho err
      error: (err: any) => {
        console.error('Lỗi tải đánh giá:', err);
        this.isLoading = false;
      }
    });
  }

  toggleVisibility(review: Review) {
    this.reviewService.toggleReviewVisibility(review.id).subscribe({
      next: () => {
        this.reviews.update(current => 
          current.map(r => r.id === review.id ? { ...r, isVisible: !r.isVisible } : r)
        );
      },
      // [SỬA] Thêm kiểu ': any' cho err
      error: (err: any) => alert('Lỗi cập nhật trạng thái: ' + err.message)
    });
  }

  deleteReview(id: number) {
    if (confirm('Xóa vĩnh viễn đánh giá này? Hành động không thể hoàn tác.')) {
      this.reviewService.deleteReview(id).subscribe({
        next: () => {
          this.reviews.update(current => current.filter(r => r.id !== id));
          alert('Đã xóa thành công!');
        },
        // [SỬA] Thêm kiểu ': any' cho err
        error: (err: any) => alert('Lỗi xóa: ' + err.message)
      });
    }
  }
}