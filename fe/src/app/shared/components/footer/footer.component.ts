import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-white border-t border-slate-100 pt-16 pb-8 text-slate-600 font-sans text-[13px] leading-6">
      <div class="container mx-auto px-4 lg:px-10">
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          <div>
            <h4 class="font-bold text-slate-800 uppercase mb-4 text-sm tracking-wide">Giới thiệu</h4>
            <ul class="space-y-2">
              <li><a routerLink="/about" class="hover:text-[#D4BEA6] transition-colors">Giới thiệu</a></li>
              <li><a routerLink="/policy/return" class="hover:text-[#D4BEA6] transition-colors">Chính sách đổi trả</a></li>
              <li><a routerLink="/policy/privacy" class="hover:text-[#D4BEA6] transition-colors">Chính sách bảo mật</a></li>
              <li><a routerLink="/policy/shipping" class="hover:text-[#D4BEA6] transition-colors">Chính sách vận chuyển</a></li>
              <li><a routerLink="/terms" class="hover:text-[#D4BEA6] transition-colors">Điều khoản dịch vụ</a></li>
              <li><a routerLink="/guide/shopping" class="hover:text-[#D4BEA6] transition-colors">Hướng dẫn mua hàng</a></li>
              <li><a routerLink="/guide/payment" class="hover:text-[#D4BEA6] transition-colors">Hướng dẫn thanh toán</a></li>
              <li><a routerLink="/contact" class="hover:text-[#D4BEA6] transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-slate-800 uppercase mb-4 text-sm tracking-wide">Thông tin công ty</h4>
            <ul class="space-y-2">
              <li class="uppercase font-semibold">Công ty cổ phần NU Việt Nam</li>
              <li>Mã số thuế: 0107126252</li>
              <li>Địa chỉ: Số 2, ngách 6/14 phố Đội Nhân, Phường Vĩnh Phúc, Quận Ba Đình, Thành phố Hà Nội, Việt Nam</li>
              <li>Điện thoại bàn: 024.66512299</li>
              <li>Hotline CSKH: <span class="text-blue-600 font-medium">0936233836</span></li>
              <li>Hotline kênh Đại lý: 0399050818</li>
              <li>Email: <a href="mailto:online@nous.com.vn" class="hover:text-[#D4BEA6]">online&#64;nous.com.vn</a></li>
              <li>Ngày cấp: 30/03/2007, Nơi cấp : Sở kế hoạch và đầu tư thành phố Hà Nội</li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-slate-800 uppercase mb-4 text-sm tracking-wide">Hệ thống cửa hàng</h4>
            <ul class="space-y-3">
              <li>
                <span class="font-semibold block text-slate-700">Nous House HCM:</span>
                79 Mạc Thị Bưởi, Quận 1, Thành phố Hồ Chí Minh – Hotline: 0988.771.875
              </li>
              <li>
                <span class="font-semibold block text-slate-700">Nous House HN:</span>
                34 Quang Trung, Trần Hưng Đạo, Hoàn Kiếm, TP. Hà Nội – Hotline: 0988.929.465
              </li>
              <li>
                <span class="font-semibold block text-slate-700">Nous Store HCM:</span>
                422B Nguyễn Thị Minh Khai, Quận 3 – Hotline: 0969.009.035
              </li>
              <li>
                <span class="font-semibold block text-slate-700">Nous Store HN:</span>
                170 Cầu Giấy, Q. Cầu Giấy, TP. Hà Nội – Hotline: 0977.177.493
              </li>
              <li>
                 Thời gian hoạt động: 9h00 - 21h30 (Thứ hai - Chủ nhật)
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-slate-800 uppercase mb-4 text-sm tracking-wide">Fanpage</h4>
            <div class="border border-slate-200 bg-slate-50 p-3 rounded-sm">
               <div class="h-32 w-full bg-cover bg-center relative" style="background-image: url('https://images.unsplash.com/photo-1515488042361-25f4682ae2c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60');">
                  <div class="absolute inset-0 bg-black/10"></div>
                  <div class="absolute top-2 left-2 flex items-center gap-2">
                     <img src="assets/img/nous-logo.png" class="w-10 h-10 bg-white rounded-full p-1 shadow-sm border" alt="Nous Logo" onerror="this.src='https://via.placeholder.com/40'">
                     <div>
                        <div class="text-white font-bold text-sm drop-shadow-md">noûs</div>
                        <div class="text-xs text-white/90 drop-shadow-md">304.531 người theo dõi</div>
                     </div>
                  </div>
                  <button class="absolute bottom-2 left-2 bg-slate-100 hover:bg-white text-xs font-semibold px-2 py-1 flex items-center gap-1 rounded shadow-sm transition">
                    <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Theo dõi Trang
                  </button>
               </div>
            </div>
          </div>

        </div>

        <div class="border-t border-slate-200 my-8"></div>

        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div class="flex-shrink-0">
             <span class="text-3xl font-light text-[#D4BEA6]">noûs</span>
             </div>

          <div class="flex flex-col md:flex-row items-center gap-4 text-xs text-slate-500">
            <span>&copy; 2025 - Powered by Haravan</span>
            <a href="#" target="_blank">
              <img src="https://file.hstatic.net/1000300454/file/logo_bct_019590483af74da09add60765f3a028e.png" alt="Bộ Công Thương" class="h-10 object-contain">
            </a>
          </div>

          <button (click)="scrollToTop()" class="w-8 h-8 border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition rounded-sm" title="Lên đầu trang">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
             </svg>
          </button>

        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}