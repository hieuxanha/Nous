import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-[#8B5E3C] uppercase tracking-wide">Tin tức & Sự kiện</h2>
          <p class="text-sm text-gray-500 mt-1">Quản lý các bài viết nổi bật trên trang chủ</p>
        </div>
        <!-- <button class="px-4 py-2 bg-[#C5A075] text-white text-sm font-semibold rounded-lg hover:bg-[#B08D6D] transition flex items-center gap-2 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm bài viết
        </button> -->
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <div *ngFor="let news of newsList" class="group cursor-pointer flex flex-col h-full">
          <div class="relative overflow-hidden rounded-2xl mb-4 shadow-sm aspect-[16/9]">
            <img [src]="news.image" [alt]="news.title" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
          </div>

          <div class="flex items-center gap-2 text-xs text-gray-500 mb-2 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ news.date }}
          </div>

          <h3 class="text-lg font-bold text-slate-700 uppercase leading-snug mb-3 group-hover:text-[#C5A075] transition-colors line-clamp-2">
            {{ news.title }}
          </h3>

          <p class="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
            {{ news.excerpt }}
          </p>

          <div class="text-sm font-semibold text-[#8B5E3C] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-auto">
            Xem thêm
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

      </div>
      
      <div class="flex justify-center mt-12">
        <nav class="flex gap-2">
            <button class="w-8 h-8 flex items-center justify-center rounded-full bg-[#C5A075] text-white text-sm font-bold">1</button>
            <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 text-sm font-medium transition">2</button>
            <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 text-sm font-medium transition">3</button>
            <span class="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
            <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 text-sm font-medium transition">></button>
        </nav>
      </div>
    </div>
  `
})
export class DashboardComponent {
  
  // Dữ liệu mô phỏng dựa trên hình ảnh bạn cung cấp
  newsList = [
    {
      id: 1,
      image: 'https://cdn.hstatic.net/files/200000692427/article/2240x1260-06_8e77609e0437444b9c797bd3f60ba8c5_grande.png', 
      date: '04 Thg 12 2025',
      title: 'LITTLE MIRACLES – KHI TỪNG KHOẢNH KHẮC ĐỀU LÀ PHÉP MÀU',
      excerpt: 'Bộ sưu tập Giáng sinh mới nhất từ Nous mang đến những thiết kế ấm áp, giúp bé tận hưởng trọn vẹn niềm vui và phép màu mùa lễ hội...'
    },
    {
      id: 2,
      image: 'https://cdn.hstatic.net/files/200000692427/article/14_11_1920x1008_1729a22271864fe3a5f90c2dd14f397a_grande.png', 
      date: '12 Thg 11 2025',
      title: 'DANH SÁCH ĐẠI LÝ CHÍNH THỨC PHÂN PHỐI BST “LITTLE MIRACLES”',
      excerpt: 'Mùa Giáng Sinh ấm áp lại ghé về! Hãy cùng Nous tận hưởng trọn vẹn niềm vui và phép màu mùa lễ hội qua những thiết kế mềm mại, tinh tế...'
    },
    {
      id: 3,
      image: 'https://file.hstatic.net/200000692427/article/490749072_999331609041845_4161611446001790613_n_df65c94adac14e12b8b5c7e956b3d953_grande.jpg', 
      date: '17 Thg 6 2025',
      title: 'DANH SÁCH ĐẠI LÝ CHÍNH THỨC THAM GIA NOUS PARTY 2025',
      excerpt: 'Sự kiện thường niên chỉ diễn ra một lần duy nhất trong năm, là dịp lý tưởng để ba mẹ "săn" những sản phẩm chất lượng với mức giá cực kỳ ưu đãi...'
    },
    {
      id: 4,
      image: 'https://file.hstatic.net/200000692427/article/cover_bai_pr_party_2024_e0f1883726544061988887413665335b_1024x1024.jpg', 
      date: '13 Thg 6 2025',
      title: 'NOUS 10TH BIRTHDAY PARTY – ĐẠI TIỆC MUA SẮM LỚN NHẤT TRONG NĂM',
      excerpt: 'Nous Party là sự kiện thường niên nhằm tri ân tới các khách hàng đã ủng hộ và lựa chọn Nous đồng hành chăm sóc và nâng niu các em bé...'
    },
    {
      id: 5,
      image: 'https://file.hstatic.net/200000692427/article/cover_bai_pr_deal_he_nous_mom_26eb0505105e45a299d45a953185a6a6_1024x1024.jpg', 
      date: '02 Thg 6 2025',
      title: 'THỜI TRANG NOUS MOM – DEAL HÈ MỀM MẠI CHO MẸ',
      excerpt: 'Dù ở nhà chăm con hay trong những phút giây thư giãn, mẹ luôn xứng đáng được chăm sóc dịu dàng trong những trang phục đẹp và thoải mái nhất...'
    },
    {
      id: 6,
      image: 'https://file.hstatic.net/200000692427/article/cover_bai_pr_dao_ri_rao_b7562725e19747209f2d1891a99859f5_1024x1024.jpg', 
      date: '02 Thg 5 2025',
      title: 'HẢI TRÌNH DIỆU KỲ CÙNG NOUS',
      excerpt: 'Chào đón mùa hè đầu tiên ngập tràn ánh nắng, Nous ra mắt Bộ sưu tập Tháng 4 "Đảo rì rào" – bản hoà tấu dịu dàng từ sóng biển, gió nhẹ và...'
    }
  ];
}