import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

// --- ĐỊNH NGHĨA MODEL NGAY TẠI ĐÂY ĐỂ TRÁNH LỖI IMPORT ---
// (Hoặc bạn có thể cập nhật file product.model.ts của bạn giống thế này)
interface Product {
  id: number;
  sku: string;
  name: string;
  quantity: number;
  description?: string;
  price: number;
  size?: string;
  image?: string;
  status?: string;
  // Khớp với Backend DTO
  categoryName?: string;
  categoryId?: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Quản lý sản phẩm</h1>
          <p class="text-slate-500 text-sm mt-1">Danh sách sản phẩm và tồn kho</p>
        </div>
        <button (click)="openModal()" class="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Thêm sản phẩm
        </button>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4">Sản phẩm</th>
                <th class="px-6 py-4">SKU</th>
                <th class="px-6 py-4">Danh mục</th>
                <th class="px-6 py-4">Giá</th>
                <th class="px-6 py-4">Số lượng</th>
                <th class="px-6 py-4">Size</th>
                <th class="px-6 py-4">Trạng thái</th>
                <th class="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let p of products()" class="hover:bg-slate-50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      <img *ngIf="p.image" [src]="p.image" class="h-full w-full object-cover">
                      <span *ngIf="!p.image" class="text-xs text-slate-400">No Img</span>
                    </div>
                    <div>
                      <div class="font-medium text-slate-700">{{ p.name }}</div>
                      <div class="text-xs text-slate-400 truncate max-w-[150px]">{{ p.description }}</div>
                    </div>
                  </div>
                </td>
                
                <td class="px-6 py-4 font-mono text-xs">{{ p.sku }}</td>
                
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {{ p.categoryName || 'N/A' }}
                  </span>
                </td>

                <td class="px-6 py-4 font-medium text-slate-700">{{ p.price | number }} đ</td>
                
                <td class="px-6 py-4">
                  <span [ngClass]="p.quantity > 0 ? 'text-slate-700' : 'text-red-500 font-bold'">
                    {{ p.quantity }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <div class="flex gap-1 flex-wrap max-w-[150px]">
                    <span *ngFor="let s of (p.size ? p.size.split(',') : [])" class="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] border border-slate-200">
                      {{ s }}
                    </span>
                  </div>
                </td>
                
                <td class="px-6 py-4">
                  <span [ngClass]="p.status === 'Còn hàng' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ p.status }}
                  </span>
                </td>

                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button (click)="openModal(p)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button (click)="onDelete(p.id)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Xóa">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="products().length === 0 && !isLoading">
                <td colspan="8" class="px-6 py-12 text-center text-slate-400">Không có dữ liệu sản phẩm.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div *ngIf="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div (click)="closeModal()" class="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity z-40"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div class="relative z-50 inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
            <div class="bg-white px-6 py-6">
              <h3 class="text-xl font-bold text-slate-900 mb-6">
                {{ isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới' }}
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div class="col-span-2 md:col-span-1">
                  <label class="block text-sm font-medium text-slate-700 mb-1">Tên sản phẩm *</label>
                  <input type="text" formControlName="name" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm px-3 py-2 border">
                </div>

                <div class="col-span-2 md:col-span-1">
                  <label class="block text-sm font-medium text-slate-700 mb-1">Mã SKU *</label>
                  <input type="text" formControlName="sku" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm px-3 py-2 border">
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Danh mục *</label>
                  <select formControlName="categoryId" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm px-3 py-2 border bg-white">
                    <option value="" disabled>-- Chọn danh mục --</option>
                    <option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Giá bán (VNĐ) *</label>
                  <input type="number" formControlName="price" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm px-3 py-2 border">
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Số lượng tồn kho *</label>
                  <input type="number" formControlName="quantity" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm px-3 py-2 border">
                </div>

                <div class="col-span-2 md:col-span-1">
                  <label class="block text-sm font-medium text-slate-700 mb-1">Kích thước (Nhập -> Enter)</label>
                  <div class="flex flex-wrap gap-2 p-2 border rounded-lg border-slate-300 bg-white min-h-[42px] items-center">
                    <span *ngFor="let s of sizeList" class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1 font-medium">
                      {{ s }}
                      <button type="button" (click)="removeSize(s)" class="hover:text-blue-900 font-bold ml-1">×</button>
                    </span>
                    <input #sizeInput type="text" 
                           (keydown.enter)="$event.preventDefault(); addSize(sizeInput.value); sizeInput.value=''" 
                           placeholder="S, M..." 
                           class="outline-none flex-1 bg-transparent text-sm min-w-[50px]">
                  </div>
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-slate-700 mb-1">Hình ảnh sản phẩm</label>
                  <div class="flex items-center gap-4">
                    <div class="h-20 w-20 bg-slate-100 rounded-lg border flex items-center justify-center overflow-hidden shrink-0">
                      <img *ngIf="previewImage" [src]="previewImage" class="h-full w-full object-cover">
                      <span *ngIf="!previewImage" class="text-xs text-slate-400">No Img</span>
                    </div>
                    
                    <div class="flex-1">
                      <input type="file" (change)="onFileSelected($event)" accept="image/*" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer">
                      <p *ngIf="isUploading" class="text-xs text-blue-600 mt-1 animate-pulse">Đang tải ảnh lên...</p>
                    </div>
                  </div>
                  <input type="hidden" formControlName="image">
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-slate-700 mb-1">Mô tả chi tiết</label>
                  <textarea formControlName="description" rows="3" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm px-3 py-2 border"></textarea>
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                  <select formControlName="status" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm px-3 py-2 border bg-white">
                    <option value="Còn hàng">Còn hàng</option>
                    <option value="Hết hàng">Hết hàng</option>
                    <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
                  </select>
                </div>

              </div>
            </div>
            
            <div class="bg-slate-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-100">
              <button type="submit" [disabled]="productForm.invalid || isUploading" class="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 focus:outline-none disabled:opacity-50 transition-colors">
                {{ isEditing ? 'Lưu thay đổi' : 'Thêm mới' }}
              </button>
              <button type="button" (click)="closeModal()" class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none transition-colors">
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = false;
  isModalOpen = false;
  isEditing = false;
  editingId: number | null = null;

  previewImage: string | null = null;
  isUploading = false;
  sizeList: string[] = [];

  productForm: FormGroup = this.fb.group({
    sku: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    size: [''], 
    image: [''],
    status: ['Còn hàng'],
    categoryId: ['', Validators.required]
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.categoryService.getAll().subscribe({
        next: (cats) => this.categories.set(cats),
        error: (err) => console.error('Lỗi danh mục', err)
    });

    this.productService.getAll().subscribe({
      next: (data) => {
        // Cast về Product[] (bao gồm cả categoryName, categoryId)
        this.products.set(data as unknown as Product[]); 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi sản phẩm:', err);
        this.isLoading = false;
      }
    });
  }

  addSize(value: string) {
    const s = value.trim().toUpperCase();
    if (s && !this.sizeList.includes(s)) {
      this.sizeList.push(s);
      this.productForm.patchValue({ size: this.sizeList.join(',') });
    }
  }

  removeSize(value: string) {
    this.sizeList = this.sizeList.filter(s => s !== value);
    this.productForm.patchValue({ size: this.sizeList.join(',') });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<any>('http://localhost:8080/files/upload', formData).subscribe({
        next: (res) => {
          this.isUploading = false;
          this.previewImage = res.url; 
          this.productForm.patchValue({ image: res.url });
        },
        error: (err) => {
          this.isUploading = false;
          alert('Lỗi upload ảnh: ' + err.message);
        }
      });
    }
  }

  openModal(product?: Product) {
    this.isModalOpen = true;
    if (product) {
      this.isEditing = true;
      this.editingId = product.id;
      this.previewImage = product.image || null;
      
      this.sizeList = product.size ? product.size.split(',') : [];

      this.productForm.patchValue({
        sku: product.sku,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        size: product.size,
        image: product.image,
        status: product.status,
        // DÙNG CATEGORY ID TỪ BACKEND
        categoryId: product.categoryId 
      });
    } else {
      this.isEditing = false;
      this.editingId = null;
      this.previewImage = null;
      this.sizeList = [];
      this.productForm.reset({ status: 'Còn hàng', price: 0, quantity: 0, categoryId: '' });
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      
      if (this.isEditing && this.editingId) {
        this.productService.update(this.editingId, formData).subscribe({
          next: () => {
            alert('Cập nhật thành công!');
            this.loadData();
            this.closeModal();
          },
          error: (err) => alert('Lỗi: ' + (err.error?.message || err.message))
        });
      } else {
        this.productService.add(formData).subscribe({
          next: () => {
            alert('Thêm mới thành công!');
            this.loadData();
            this.closeModal();
          },
          error: (err) => alert('Lỗi: ' + (err.error?.message || err.message))
        });
      }
    }
  }

  onDelete(id: number) {
    if (confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          alert('Đã xóa!');
          this.loadData();
        },
        error: (err) => alert('Lỗi xóa: ' + err.message)
      });
    }
  }
}