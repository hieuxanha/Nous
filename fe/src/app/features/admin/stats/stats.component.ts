import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatsService } from '../../../core/services/stats.service';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- HEADER & FILTER -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 class="text-xl font-bold text-slate-700 uppercase">Báo cáo thống kê</h2>
          <p class="text-sm text-gray-500">Số liệu kinh doanh chi tiết</p>
        </div>
        <div class="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
          <button 
            *ngFor="let filter of filters" 
            (click)="changeFilter(filter)" 
            [class.bg-white]="activeFilter === filter"
            [class.shadow-sm]="activeFilter === filter"
            [class.text-[#C5A075]]="activeFilter === filter"
            class="px-4 py-1.5 text-sm font-medium text-gray-500 rounded-md transition-all">
            {{ filter }}
          </button>
        </div>
      </div>

      <!-- KPI CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let item of kpiData" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition duration-300">
          <div class="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition group-hover:scale-110" [ngClass]="item.bgClass"></div>
          <div class="relative z-10">
            <p class="text-sm font-medium text-gray-500 mb-1">{{ item.label }}</p>
            <h3 class="text-2xl font-bold text-slate-700">{{ item.value }}</h3>
            <div class="flex items-center gap-2 mt-4 text-xs font-semibold">
              <span [class]="item.isIncrease ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'" class="px-2 py-1 rounded-full flex items-center gap-1">
                {{ item.percent }}%
                <span *ngIf="item.isIncrease">↗</span><span *ngIf="!item.isIncrease">↘</span>
              </span>
              <span class="text-gray-400">so với kỳ trước</span>
            </div>
          </div>
        </div>
      </div>

      <!-- REVENUE CHART -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-8">
          <h3 class="font-bold text-slate-700 flex items-center gap-2">
            <span class="w-2 h-6 bg-[#C5A075] rounded-sm"></span> Biểu đồ doanh thu
          </h3>
          <div class="text-sm text-gray-500">Đơn vị: Triệu VNĐ</div>
        </div>
        <div class="h-72 w-full flex items-end justify-between gap-2 sm:gap-4 px-2">
          <div *ngFor="let col of revenueData" class="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
            <div class="opacity-0 group-hover:opacity-100 transition mb-2 bg-slate-800 text-white text-xs py-1 px-2 rounded absolute -mt-8 whitespace-nowrap z-20">
              {{ col.fullValue }}
            </div>
            <div class="w-full bg-[#F5F0EB] rounded-t-md relative h-full flex items-end overflow-hidden">
              <div [style.height]="col.percent + '%'" 
                   [style.minHeight]="col.percent > 0 ? '4px' : '0'"
                   class="w-full bg-[#C5A075] group-hover:bg-[#B08D6D] transition-all duration-700 rounded-t-md relative">
              </div>
            </div>
            <span class="text-xs text-gray-400 font-medium group-hover:text-[#C5A075]">{{ col.label }}</span>
          </div>
        </div>
      </div>

      <!-- CATEGORY & TOP PRODUCTS -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- CATEGORY STATS -->
        <div class="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="font-bold text-slate-700 mb-6">Tỷ trọng doanh thu</h3>
          <div class="space-y-6">
            <div *ngFor="let cat of categoryStats">
              <div class="flex justify-between text-sm mb-2">
                <span class="font-medium text-slate-600">{{ cat.name }}</span>
                <span class="font-bold text-slate-700">{{ cat.percent }}%</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div [style.width]="cat.percent + '%'" [ngClass]="cat.color" class="h-2.5 rounded-full"></div>
              </div>
              <p class="text-xs text-gray-400 mt-1 text-right">{{ cat.value }}</p>
            </div>
          </div>
        </div>

        <!-- TOP PRODUCTS -->
        <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-slate-700">Top sản phẩm bán chạy</h3>
            <button class="text-sm text-[#B08D6D] hover:underline">Xuất Excel</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-[#FFFBF3] text-[#8B5E3C] uppercase text-xs font-bold">
                <tr>
                  <th class="px-4 py-3 rounded-l-lg">Sản phẩm</th>
                  <th class="px-4 py-3">Đã bán</th>
                  <th class="px-4 py-3">Tồn kho</th>
                  <th class="px-4 py-3 text-right rounded-r-lg">Doanh thu</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr *ngFor="let prod of topProducts" class="hover:bg-gray-50 transition">
                  <td class="px-4 py-4">
                    <div class="flex items-center gap-3">
                      <img [src]="prod.image" class="w-10 h-10 rounded-md object-cover border border-gray-200">
                      <div>
                        <div class="font-semibold text-slate-700">{{ prod.name }}</div>
                        <div class="text-xs text-gray-400">{{ prod.sku }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 font-medium">{{ prod.sold }}</td>
                  <td class="px-4 py-4 text-gray-500">
                    <span [class]="prod.stock < 10 ? 'text-red-500' : 'text-gray-500'">{{ prod.stock }}</span>
                  </td>
                  <td class="px-4 py-4 text-right font-bold text-[#C5A075]">{{ prod.revenue }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  `
})
export class StatsComponent implements OnInit {
  private statsService = inject(StatsService);

  filters = ['Hôm nay', 'Tuần này', 'Tháng này', 'Năm nay'];
  activeFilter = 'Tháng này';

  kpiData: any[] = [];
  revenueData: any[] = [];
  categoryStats: any[] = [];
  topProducts: any[] = [];

  ngOnInit() {
    this.fetchData(this.activeFilter);
  }

  changeFilter(filter: string) {
    this.activeFilter = filter;
    this.fetchData(filter);
  }

  fetchData(filter: string) {
    this.statsService.getStats(filter).subscribe({
      next: (res) => {
        this.kpiData = res.kpis.map((item: any) => ({
          ...item,
          bgClass: this.getKpiBgClass(item.type)
        }));

        this.revenueData = res.revenueChart;

        const catColors = ['bg-[#C5A075]', 'bg-[#D4BEA6]', 'bg-slate-400', 'bg-slate-200'];
        this.categoryStats = res.categoryStats.map((item: any, index: number) => ({
          ...item,
          color: catColors[index % catColors.length]
        }));

        this.topProducts = res.topProducts;
      },
      error: (err) => console.error('Lỗi lấy thống kê:', err)
    });
  }

  getKpiBgClass(type: string): string {
    switch (type) {
      case 'REVENUE': return 'bg-[#C5A075]';
      case 'PROFIT': return 'bg-green-500';
      case 'ORDERS': return 'bg-blue-500';
      case 'RETURN': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }
}
