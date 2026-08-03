import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../core/services/inventory.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      
      <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h2 class="text-lg font-bold text-slate-800">Quản lý Kho hàng</h2>
          <p class="text-xs text-slate-500 mt-1">Trang {{ currentPage + 1 }} / {{ totalPages }} (Tổng {{ totalElements }} sản phẩm)</p>
        </div>
        <div class="font-bold text-slate-700">Tổng giá trị (trang này): {{ getTotalValue() | number:'1.0-0' }}₫</div>
      </div>

      <div class="overflow-x-auto min-h-[400px]"> 
        <table class="w-full text-sm text-left">
           <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th class="px-6 py-4">#</th>
              <th class="px-6 py-4">Sản phẩm</th>
              <th class="px-6 py-4 text-center">Tồn kho</th>
              <th class="px-6 py-4 text-center">Trạng thái</th>
              <th class="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-50">
            <ng-container *ngFor="let item of products()">
                <tr class="hover:bg-slate-50 transition-colors">
                     <td class="px-6 py-4 text-center text-slate-400">{{ item.id }}</td>
                     <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <img [src]="item.image || 'assets/img/placeholder.png'" class="w-10 h-10 rounded border object-cover">
                            <div class="font-bold text-slate-700">{{ item.name }}</div>
                        </div>
                     </td>
                     
                     <td class="px-6 py-4 text-center">
                        <span class="font-bold" [ngClass]="getStockTextClass(item.quantity)">{{ item.quantity }}</span>
                     </td>

                     <td class="px-6 py-4 text-center">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border"
                              [ngClass]="getStatusBadgeClass(item.quantity)">
                          {{ getStatusLabel(item.quantity) }}
                        </span>
                     </td>

                     <td class="px-6 py-4 text-right">
                         <button (click)="openUpdateStock(item)" class="text-blue-600 hover:underline text-xs mr-3 font-medium">Sửa kho</button>
                         <button (click)="toggleHistory(item)" class="text-[#cc8d8d] hover:underline text-xs font-bold">
                            {{ expandedProductId === item.id ? 'Đóng' : 'Lịch sử' }}
                         </button>
                     </td>
                </tr>
                
                <tr *ngIf="expandedProductId === item.id">
                    <td colspan="5" class="bg-slate-50 p-4 shadow-inner">
                        <div *ngIf="isLoadingHistory" class="text-center text-xs text-slate-500 py-2">Đang tải lịch sử...</div>
                        
                        <div *ngIf="!isLoadingHistory" class="bg-white rounded border border-slate-200 overflow-hidden">
                             <table class="w-full text-xs text-left">
                                <thead class="bg-slate-100 text-slate-500 font-medium">
                                    <tr>
                                        <th class="px-4 py-2">Thời gian</th>
                                        <th class="px-4 py-2 text-center">Thay đổi</th>
                                        <th class="px-4 py-2 text-center">Tồn sau</th>
                                        <th class="px-4 py-2">Lý do</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr *ngFor="let log of historyLogs()" class="border-b border-slate-50 last:border-0">
                                        <td class="px-4 py-2 text-slate-500">{{ log.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                                        <td class="px-4 py-2 text-center font-bold" 
                                            [ngClass]="log.changeAmount > 0 ? 'text-green-600' : 'text-red-600'">
                                            {{ log.changeAmount > 0 ? '+' : '' }}{{ log.changeAmount }}
                                        </td>
                                        <td class="px-4 py-2 text-center text-slate-700 font-bold">{{ log.remainingQuantity }}</td>
                                        <td class="px-4 py-2 text-slate-600 italic">{{ log.reason }}</td>
                                    </tr>
                                    <tr *ngIf="historyLogs().length === 0">
                                        <td colspan="4" class="px-4 py-3 text-center text-slate-400">Chưa có lịch sử biến động.</td>
                                    </tr>
                                </tbody>
                             </table>
                        </div>
                    </td>
                </tr>
            </ng-container>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
        <span class="text-xs text-slate-500">
            Hiển thị {{ products().length }} kết quả
        </span>
        
        <div class="flex items-center gap-2">
            <button (click)="changePage(currentPage - 1)" 
                    [disabled]="currentPage === 0"
                    class="px-3 py-1 bg-white border border-slate-300 rounded text-xs hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Trước
            </button>
            
            <span class="px-3 py-1 bg-[#cc8d8d] text-white rounded text-xs font-bold shadow-sm">
                {{ currentPage + 1 }}
            </span>
            
            <button (click)="changePage(currentPage + 1)" 
                    [disabled]="currentPage >= totalPages - 1"
                    class="px-3 py-1 bg-white border border-slate-300 rounded text-xs hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Sau
            </button>
        </div>
      </div>

    </div>
  `
})
export class InventoryComponent implements OnInit {
  inventoryService = inject(InventoryService);
  
  products = signal<any[]>([]);
  
  // 1. CẤU HÌNH PHÂN TRANG
  currentPage = 0;
  pageSize = 5; // Số lượng 5 sản phẩm/trang
  totalPages = 0;
  totalElements = 0;

  // Cấu hình lịch sử
  expandedProductId: number | null = null;
  historyLogs = signal<any[]>([]);
  isLoadingHistory = false;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // 2. SỬA LỖI TẠI ĐÂY: Truyền currentPage và pageSize vào hàm gọi API
    this.inventoryService.getInventory(this.currentPage, this.pageSize).subscribe({
        next: (response: any) => {
            // Spring Boot trả về Page object: { content: [], totalPages: 10, ... }
            this.products.set(response.content);
            this.totalPages = response.totalPages;
            this.totalElements = response.totalElements;
        },
        error: (err) => console.error('Lỗi tải kho:', err)
    });
  }

  changePage(newPage: number) {
      if (newPage >= 0 && newPage < this.totalPages) {
          this.currentPage = newPage;
          this.loadData();
      }
  }

  getTotalValue() {
      // Tính tổng giá trị của 5 sản phẩm đang hiển thị
      return this.products().reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  }

  openUpdateStock(item: any) {
      const newStock = prompt(`Cập nhật số lượng cho "${item.name}":`, item.quantity);
      if (newStock !== null) {
          const quantity = parseInt(newStock);
          if (!isNaN(quantity) && quantity >= 0) {
              this.inventoryService.updateStock(item.id, quantity).subscribe({
                  next: () => {
                      alert("Cập nhật thành công!");
                      this.loadData(); 
                      if (this.expandedProductId === item.id) {
                           this.loadHistory(item.id);
                      }
                  },
                  error: (err) => alert("Lỗi: " + err.message)
              });
          } else {
              alert("Số lượng không hợp lệ!");
          }
      }
  }
  
  toggleHistory(item: any) {
      if (this.expandedProductId === item.id) {
          this.expandedProductId = null;
          return;
      }
      this.expandedProductId = item.id;
      this.loadHistory(item.id);
  }

  loadHistory(productId: number) {
      this.isLoadingHistory = true;
      this.inventoryService.getStockHistory(productId).subscribe({
          next: (data) => {
              this.historyLogs.set(data);
              this.isLoadingHistory = false;
          },
          error: () => this.isLoadingHistory = false
      });
  }

  // --- Helpers ---
  getStatusLabel(stock: number): string {
      if (stock === 0) return 'Hết hàng';
      if (stock <= 10) return 'Sắp hết';
      return 'Còn hàng';
  }

  getStatusBadgeClass(stock: number): string {
      if (stock === 0) return 'bg-red-50 text-red-600 border-red-200';
      if (stock <= 10) return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      return 'bg-green-50 text-green-600 border-green-200';
  }

  getStockTextClass(stock: number): string {
      if (stock === 0) return 'text-red-500';
      if (stock <= 10) return 'text-yellow-600';
      return 'text-slate-700';
  }
}