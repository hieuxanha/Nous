import { Component, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/services/chat.service';
import { RouterLink } from '@angular/router';

interface ChatMessage {
  text: string;
  isUser: boolean;
  type?: string;
  data?: any;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <button *ngIf="!isOpen()" (click)="toggleChat()" 
            class="fixed bottom-6 right-6 bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-full shadow-lg z-50 transition-transform hover:scale-110 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </button>

    <div *ngIf="isOpen()" class="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-fade-in-up">
      
      <div class="bg-rose-600 p-4 flex justify-between items-center text-white">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span class="font-bold">Trợ lý ảo Shop</span>
        </div>
        <button (click)="toggleChat()" class="hover:bg-rose-700 p-1 rounded">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div #scrollContainer class="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
        
        <div *ngFor="let msg of messages()" class="flex flex-col" [ngClass]="msg.isUser ? 'items-end' : 'items-start'">
          
          <div class="max-w-[85%] px-4 py-2 rounded-2xl text-sm"
               [ngClass]="msg.isUser ? 'bg-rose-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'">
            {{ msg.text }}
          </div>

          <div *ngIf="msg.type === 'PRODUCT_LIST'" class="mt-2 w-[85%] space-y-2">
            <div *ngFor="let p of msg.data" class="bg-white p-2 rounded-lg border border-slate-100 shadow-sm flex gap-2 hover:bg-slate-50 cursor-pointer" [routerLink]="['/products', p.id]" (click)="isOpen.set(false)">
              <img [src]="p.image || 'assets/img/placeholder.png'" class="w-10 h-10 object-cover rounded">
              <div class="overflow-hidden">
                <div class="text-xs font-bold truncate">{{ p.name }}</div>
                <div class="text-xs text-rose-600">{{ p.price | number }}đ</div>
              </div>
            </div>
          </div>

        </div>
        
        <div *ngIf="isTyping" class="flex items-center gap-1 ml-2">
            <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
            <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
        </div>

      </div>

      <div class="p-3 bg-white border-t border-slate-100">
        <form (submit)="sendMessage()" class="flex gap-2">
          <input [(ngModel)]="userInput" name="msg" placeholder="Nhập tin nhắn..." 
                 class="flex-1 text-sm border-slate-200 rounded-full px-4 py-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50">
          <button type="submit" [disabled]="!userInput.trim() || isTyping" 
                  class="bg-rose-600 text-white p-2 rounded-full hover:bg-rose-700 disabled:opacity-50 transition">
            <svg class="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </div>

    </div>
  `,
  styles: [`
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
  `]
})
export class ChatWidgetComponent {
  private chatService = inject(ChatService);
  
  isOpen = signal(false);
  userInput = '';
  isTyping = false;
  
  messages = signal<ChatMessage[]>([
    { text: 'Xin chào! Bạn cần tìm sản phẩm gì hôm nay?', isUser: false }
  ]);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  toggleChat() {
    this.isOpen.update(v => !v);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const msgText = this.userInput;
    this.userInput = ''; // Clear input

    // 1. Add User Message
    this.messages.update(msgs => [...msgs, { text: msgText, isUser: true }]);
    this.scrollToBottom();
    this.isTyping = true;

    // 2. Call API
    this.chatService.sendMessage(msgText).subscribe({
      next: (res) => {
        this.isTyping = false;
        // 3. Add Bot Response
        this.messages.update(msgs => [...msgs, { 
            text: res.response, 
            isUser: false,
            type: res.type,
            data: res.data 
        }]);
        this.scrollToBottom();
      },
      error: () => {
        this.isTyping = false;
        this.messages.update(msgs => [...msgs, { text: 'Lỗi kết nối server, vui lòng thử lại!', isUser: false }]);
      }
    });
  }

  private scrollToBottom() {
    if(this.scrollContainer) {
        setTimeout(() => {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        }, 50);
    }
  }
}