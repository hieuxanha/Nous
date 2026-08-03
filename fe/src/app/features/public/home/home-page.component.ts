import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// 1. Import Component sản phẩm vừa tạo
import { FeaturedProductsComponent } from './featured-products.component';
import { VoucherListComponent } from './voucher.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  // 2. Khai báo FeaturedProductsComponent vào imports
  imports: [CommonModule, RouterLink, FeaturedProductsComponent,VoucherListComponent], 
  template: `
    <div class="min-h-screen bg-white">
      
      <section class="relative w-full h-[400px] md:h-[600px] overflow-hidden group">
        <div 
          *ngFor="let slide of slides; let i = index"
          class="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
          [ngClass]="{'opacity-100 z-10': i === currentIndex(), 'opacity-0 z-0': i !== currentIndex()}"
        >
          <img [src]="slide.image" [alt]="slide.title" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <span class="uppercase tracking-[0.2em] text-sm md:text-base mb-2 md:mb-4 animate-fade-in-up" *ngIf="slide.subtitle">
              {{ slide.subtitle }}
            </span>
            <h2 class="text-4xl md:text-7xl font-light mb-6 md:mb-8 font-serif animate-fade-in-up delay-100" *ngIf="slide.title">
              {{ slide.title }}
            </h2>
          </div>
        </div>

        <button (click)="prevSlide()" class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 border border-white/50 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition opacity-0 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button (click)="nextSlide()" class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 border border-white/50 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition opacity-0 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          <button 
            *ngFor="let slide of slides; let i = index" 
            (click)="goToSlide(i)"
            class="w-2.5 h-2.5 rounded-full transition-all duration-300"
            [ngClass]="i === currentIndex() ? 'bg-white w-8' : 'bg-white/50 hover:bg-white'">
          </button>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-white overflow-hidden border-b border-gray-100">
        <div class="container mx-auto px-4 lg:px-12">
          <div class="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            
            <div class="w-full md:w-1/2 relative flex justify-center">
              <div class="relative w-full max-w-[450px] aspect-[4/3] md:aspect-square">
                 <img 
                 src="assets/img/con_tre_tuyet_voi_nhat.webp"
                 alt="Baby comfort" 
                 class=""
                 >
                 <div class="absolute -z-10 top-[-20px] left-[-20px] w-full h-full bg-[#F5F0EB] rounded-[40px] rounded-tr-[120px] rounded-bl-[120px]"></div>
              </div>
            </div>

            <div class="w-full md:w-1/2 text-left">
              <h2 class="text-3xl md:text-4xl font-bold text-slate-700 mb-6 leading-tight">
                Con trẻ tuyệt nhất <br>
                khi thoải mái là chính mình
              </h2>

              <div class="relative pl-2">
                <svg class="w-8 h-8 text-slate-400 mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z"/></svg>
                
                <p class="text-slate-600 text-[15px] leading-7 text-justify mb-6">
                  Mỗi thiết kế của Nous đều tuân thủ triết lý "COMFYNISTA - Thoải mái chính là thời trang", 
                  trong đó sự thoải mái của các bé được ưu tiên trong mỗi chi tiết nhỏ nhưng vẫn chứa đựng sự tinh tế và khác biệt. 
                  Vì vậy, Nous luôn được hàng triệu bà mẹ Việt Nam tin chọn nâng niu hành trình lớn khôn của bé.
                </p>

                <div class="mt-8">
                  <a routerLink="/about" class="inline-block px-10 py-3 bg-[#C8B096] text-white text-sm font-bold rounded-full shadow-md hover:bg-[#A98F73] hover:shadow-lg transition-all duration-300">
                    XEM THÊM
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
        <app-voucher-list></app-voucher-list>
      </section>

      <app-featured-products></app-featured-products>

    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
    }
    .delay-100 { animation-delay: 0.1s; }
  `]
})
export class HomePageComponent implements OnInit, OnDestroy {
  currentIndex = signal(0);
  autoSlideInterval: any;

  slides = [
    {
      image: 'https://cdn.hstatic.net/files/200000692427/file/cover_t11-05__1_.png',
      title: '',
      subtitle: 'Mềm mại & Thoáng mát',
      link: '/products'
    },
    {
      image: 'https://file.hstatic.net/200000692427/file/banner_web_nu_swim_banner_homepage_copy.jpg',
      title: '',
      subtitle: '',
      link: '/categories/newborn'
    },
    {
      image: 'https://cdn.hstatic.net/files/200000692427/file/cover_t11_desktop-02.png',
      title: '',
      subtitle: '',
      link: '/flash-sale'
    }
  ];

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  nextSlide() {
    this.currentIndex.update(index => (index + 1) % this.slides.length);
    this.resetAutoSlide();
  }

  prevSlide() {
    this.currentIndex.update(index => (index - 1 + this.slides.length) % this.slides.length);
    this.resetAutoSlide();
  }

  goToSlide(index: number) {
    this.currentIndex.set(index);
    this.resetAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}