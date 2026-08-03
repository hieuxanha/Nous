import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="font-sans text-slate-700">
      
      <section class="bg-white pt-16 pb-32 relative">
   <div class="container mx-auto px-4 text-center mb-10 md:mb-30">
        <h2 class="text-[#8B5E3C] text-3xl md:text-4xl font-bold uppercase mb-4 tracking-wide">
          Sản phẩm của Nous
        </h2>
        <!-- <p class="text-sm text-gray-500 max-w-2xl mx-auto italic leading-relaxed">
          "Chúng tôi mong muốn mang đến sản phẩm có chất lượng hàng đầu cùng cải tiến đột phá, 
          đồng hành cùng bé từ những ngày đầu tiên."
        </p> -->
      </div>

      <div class="absolute w-full left-0 bottom-[calc(100%-80px)] z-10 flex justify-center items-end gap-8 md:gap-20 translate-y-[330px] md:translate-y-[270px]">
        
        <div class="flex flex-col items-center gap-3 relative group">
          <div class="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#EFE4D5] border-4 border-white shadow-sm transition-transform group-hover:scale-105">
             <img src="assets/img/Phu_kien.png" class="absolute left-1/2 -translate-x-1/2 -bottom-4 w-28 h-28 md:w-36 md:h-36 max-w-none object-contain drop-shadow-xl opacity-90 transition-all group-hover:-translate-y-2" alt="Phụ kiện">
          </div>
          <span class="text-xs md:text-sm font-bold text-slate-600 uppercase relative z-20 mt-4">Phụ kiện</span>
        </div>
        
        <div class="flex flex-col items-center gap-3 -mt-8 md:-mt-12 relative group z-20">
          <div class="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#EFE4D5] border-4 border-white shadow-md transition-transform group-hover:scale-105">
            <img src="assets/img/Aoa.png" class="absolute left-1/2 -translate-x-1/2 -bottom-5 w-36 h-36 md:w-48 md:h-48 max-w-none object-contain drop-shadow-2xl opacity-90 transition-all group-hover:-translate-y-2" alt="Quần áo">
          </div>
          <span class="text-xs md:text-sm font-bold text-slate-600 uppercase relative z-20 mt-6">Quần áo</span>
        </div>

        <div class="flex flex-col items-center gap-3 relative group">
          <div class="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#EFE4D5] border-4 border-white shadow-sm transition-transform group-hover:scale-105">
            <img src="assets/img/cun.png" class="absolute left-1/2 -translate-x-1/2 -bottom-4 w-28 h-28 md:w-36 md:h-36 max-w-none object-contain drop-shadow-xl opacity-90 transition-all group-hover:-translate-y-2" alt="Quà tặng">
          </div>
          <span class="text-xs md:text-sm font-bold text-slate-600 uppercase relative z-20 mt-4">Quà tặng</span>
        </div>

      </div>

      </section>

      <section class="bg-[#F3EEE8] pt-32 pb-20 rounded-t-[50%_100px] md:rounded-t-[80%_200px] -mt-20 relative z-0">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            
            <div *ngFor="let item of collections" class="group cursor-pointer">
              <div class="bg-white p-3 pb-6 shadow-md transform group-hover:-translate-y-2 transition-transform duration-300 rotate-1 group-hover:rotate-0">
                <div class="aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                  <img [src]="item.img" class="w-full h-full object-cover" [alt]="item.name">
                </div>
                <h3 class="text-center font-bold text-slate-600 uppercase text-sm tracking-wide">{{ item.name }}</h3>
              </div>
            </div>

          </div>
        </div>
      </section>


      <section class="bg-[#F3EEE8] pb-24"> <div class="container mx-auto px-4 md:px-10">
          
          <div class="text-center mb-12">
            <h2 class="text-[#8B5E3C] text-3xl md:text-4xl font-bold uppercase mb-2">Chất liệu độc quyền</h2>
            <p class="text-xs text-gray-500 uppercase tracking-widest">An toàn và chuyên biệt dành cho trẻ em</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div *ngFor="let mat of materials" class="bg-white rounded-xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition">
              <div class="p-6 flex-1">
                <h3 class="text-2xl font-bold mb-3 lowercase" [ngStyle]="{'color': mat.color}">
                  <span class="text-gray-300 text-lg align-top mr-1">nu</span>{{ mat.name }}
                </h3>
                <p class="text-[13px] text-gray-500 leading-relaxed text-justify">
                  {{ mat.desc }}
                </p>
              </div>
              
              <div class="h-48 w-full bg-gray-50 relative group">
                <img [src]="mat.img" class="w-full h-full object-cover" [alt]="mat.name">
                <!-- <div class="absolute bottom-2 right-2 text-white/80 text-xs bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  Mặt sau
                </div> -->
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    /* Tùy chỉnh thêm nếu Tailwind không đủ */
    :host {
      display: block;
    }
  `]
})
export class AboutPageComponent {
  // Dữ liệu giả lập cho các bộ sưu tập (Polaroid)
  collections = [
    { name: 'Nous Premium', img: 'assets/img/nuos_premium.png' },
    { name: 'Nous Petit à Petit', img: 'assets/img/petit.png' },
    { name: 'Nous Outdoor+', img: 'assets/img/outdooor.png' },
    { name: 'Nous Mom', img: 'assets/img/mom.png' }
  ];

  // Dữ liệu cho phần chất liệu
  materials = [
    { 
      name: 'petit', 
      color: '#9BB7D4', // Xanh nhạt
      desc: 'Sở hữu đặc tính ưu việt của sợi tre, Nu Petit co giãn vượt trội, đàn hồi linh hoạt và bền hơn nhiều lần các chất liệu thông thường.',
      img: 'assets/img/petit.jpg'
    },
    { 
      name: 'air', 
      color: '#A8D5BA', // Xanh lá nhạt
      desc: 'Nu Air có cấu trúc dệt phức tạp, họa tiết trên vải được tạo ra từ những lỗ thoáng khí, mang đến chất liệu mềm mại và thông thoáng.',
         img: 'assets/img/air.jpg'
    },
    { 
      name: 'muslin', 
      color: '#D4B5D8', // Tím nhạt
      desc: 'Nu Muslin được mệnh danh là chất liệu an toàn nhất với bé. Sợi vải bền bỉ, không bai dão. Kết cấu dệt hở đảm bảo mềm mại và chống ngạt hiệu quả.',
         img: 'assets/img/muslin.jpg'
    },
    { 
      name: 'bamboo', 
      color: '#D4D685', // Vàng chanh
      desc: 'Nu Bamboo kế thừa ưu điểm tuyệt vời của vải Muslin kết hợp cùng đặc tính sợi tre, mang tới chất liệu mượt mà, kháng khuẩn.',
     img: 'assets/img/bamboo.jpg'    },
    { 
      name: 'doux', 
      color: '#E6C685', // Vàng cam
      desc: 'Nu Doux với thành phần sợi đặc biệt, mang đến chất liệu bền chắc, sợi vải đanh, co giãn mềm mại, giữ form tốt, nhẹ nhàng vỗ về da.',
     img: 'assets/img/nu_doux.jpg'
        },
    { 
      name: 'choux', 
      color: '#EFA8A8', // Hồng
      desc: 'Chất liệu thu đông Nu Choux với kỹ thuật chần bông cao cấp giúp bề mặt vải thoáng khí mà vẫn tăng cường giữ nhiệt hiệu quả.',
     img: 'assets/img/nu_choux.jpg' 
       },
    { 
      name: 'thermo', 
      color: '#A8A8A8', // Xám
      desc: 'Nu Thermo nổi bật ở đặc tính co giãn và đàn hồi tốt nhờ công nghệ dệt borip, sợi dệt đường kính siêu mảnh, ôm vừa vặn cơ thể, giữ nhiệt hiệu quả.',
     img: 'assets/img/thermo.jpg'  
      },
    { 
      name: 'velours', 
      color: '#C4B5A5', // Nâu nhạt
      desc: 'Nu Velours sở hữu bề mặt vải êm ái như nhung, sợi vải có đặc tính tương tự sợi len giúp giữ ấm và tạo cảm giác êm ái.',
     img: 'assets/img/velour.jpg'    
    }
  ];
}