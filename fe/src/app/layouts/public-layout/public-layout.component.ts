// src/app/layouts/public-layout/public-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 1. Import Header
import { HeaderComponent } from '../../shared/components/header/header.component'; 
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartDrawerComponent } from '../../shared/components/cart-drawer/cart-drawer.component'; // Import Component mới tạo
import { ChatWidgetComponent } from '../../features/public/chat/chat-widget.component'; // Import

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent,CartDrawerComponent,ChatWidgetComponent], // 2. Khai báo Header ở đây
  template: `
    <app-header></app-header>

    <main>
       <router-outlet></router-outlet>
       <app-chat-widget></app-chat-widget>
    </main>
    <app-footer></app-footer>
    <app-cart-drawer></app-cart-drawer>
    
    `
})
export class PublicLayoutComponent {}