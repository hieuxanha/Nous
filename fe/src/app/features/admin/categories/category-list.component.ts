import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Quản lý danh mục</h1>
        </div>
        <button (click)="openModal()" class="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm danh mục
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-slate-500 text-xs font-medium uppercase">Tổng danh mục</div>
          <div class="text-2xl font-bold text-slate-700 mt-1">{{ categories().length }}</div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-slate-500 text-xs font-medium uppercase">Đã tải xong</div>
          <div class="text-2xl font-bold text-emerald-600 mt-1">{{ categories().length > 0 ? 'Yes' : 'No' }}</div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4 w-16">ID</th>
                <th class="px-6 py-4">Tên danh mục</th>
                <th class="px-6 py-4">Mô tả</th>
                <th class="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let cat of categories()" class="hover:bg-slate-50 transition-colors group">
                <td class="px-6 py-4 font-mono text-slate-400">#{{ cat.id }}</td>
                <td class="px-6 py-4 font-medium text-slate-700">{{ cat.name }}</td>
                <td class="px-6 py-4 text-slate-500 truncate max-w-xs">{{ cat.description || 'Chưa có mô tả' }}</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button (click)="openModal(cat)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button (click)="onDelete(cat.id)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Xóa">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="categories().length === 0 && !isLoading">
                <td colspan="4" class="px-6 py-12 text-center text-slate-400">
                  <div class="flex flex-col items-center">
                    <p>Chưa có danh mục nào.</p>
                  </div>
                </td>
              </tr>
               <tr *ngIf="isLoading">
                <td colspan="4" class="px-6 py-12 text-center text-slate-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div *ngIf="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div (click)="closeModal()" class="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity z-40" aria-hidden="true"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="relative z-50 inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-bold text-slate-900 mb-4" id="modal-title">
                {{ isEditing ? 'Cập nhật danh mục' : 'Thêm danh mục mới' }}
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Tên danh mục <span class="text-rose-500">*</span></label>
                  <input type="text" formControlName="name" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm px-3 py-2 border" placeholder="Nhập tên danh mục">
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                  <textarea formControlName="description" rows="3" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm px-3 py-2 border" placeholder="Mô tả..."></textarea>
                </div>
              </div>
            </div>
            
            <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100">
              <button type="submit" [disabled]="categoryForm.invalid" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
              </button>
              <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  // Signals
  categories = signal<Category[]>([]);
  isLoading = false;

  // Modal State
  isModalOpen = false;
  isEditing = false;
  editingId: number | null = null;

  // Form
  categoryForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  // 1. Chạy hàm lấy dữ liệu khi Component khởi tạo
  ngOnInit() {
    this.loadCategories();
  }

  // Hàm gọi API lấy danh sách
  loadCategories() {
    this.isLoading = true;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi tải danh mục:', err);
        this.isLoading = false;
      }
    });
  }

  // --- Modal Logic ---
  openModal(category?: Category) {
    this.isModalOpen = true;
    if (category) {
      this.isEditing = true;
      this.editingId = category.id;
      this.categoryForm.patchValue({
        name: category.name,
        description: category.description
      });
    } else {
      this.isEditing = false;
      this.editingId = null;
      this.categoryForm.reset();
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // --- CRUD Logic (Gọi API thật) ---
  onSubmit() {
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.value;
      
      if (this.isEditing && this.editingId) {
        // Gọi API Update
        this.categoryService.update(this.editingId, formData).subscribe({
            next: (res) => {
                alert('Cập nhật thành công!');
                this.loadCategories(); // Tải lại danh sách
                this.closeModal();
            },
            error: (err) => alert('Lỗi cập nhật: ' + err.message)
        });
      } else {
        // Gọi API Create
        this.categoryService.add(formData).subscribe({
            next: (res) => {
                alert('Thêm mới thành công!');
                this.loadCategories(); // Tải lại danh sách
                this.closeModal();
            },
            error: (err) => alert('Lỗi thêm mới: ' + err.message)
        });
      }
    }
  }

  onDelete(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      // Gọi API Delete
      this.categoryService.delete(id).subscribe({
        next: () => {
            alert('Xóa thành công!');
            this.loadCategories(); // Tải lại danh sách sau khi xóa
        },
        error: (err) => alert('Không thể xóa: ' + err.message)
      });
    }
  }
}