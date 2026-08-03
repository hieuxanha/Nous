import { Injectable, signal, computed, inject } from '@angular/core'; // 1. Import computed
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/cart'; 

  // --- QUẢN LÝ UI (DRAWER) ---
  isOpen = signal(false);

  open() {
    this.isOpen.set(true);
    this.getCart().subscribe(); // Mở ra là load lại data mới nhất
  }

  close() {
    this.isOpen.set(false);
  }

  toggle() {``
    this.isOpen.update(v => !v);
    if (this.isOpen()) this.getCart().subscribe();
  }

  // --- QUẢN LÝ DỮ LIỆU (STATE) ---
  cart = signal<Cart | null>(null);

  // [QUAN TRỌNG] Tự động tính tổng số lượng item trong giỏ
  // Header sẽ gọi hàm này để hiển thị số
  cartCount = computed(() => {
    const currentCart = this.cart();
    if (!currentCart || !currentCart.items) return 0;
    return currentCart.items.reduce((acc, item) => acc + item.quantity, 0);
  });

  // --- API CALLS ---

  // 1. Lấy giỏ hàng
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap((data: Cart) => this.cart.set(data)) 
    );
  }

  // 2. Thêm vào giỏ (Sửa để nhận Payload Object cho chuẩn)
  addToCart(payload: { productId: number, quantity: number, size: string }): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, payload).pipe(
      tap((data: Cart) => {
        this.cart.set(data); // Cập nhật dữ liệu
        this.open();         // Mở drawer
      })
    );
  }

  // 3. Cập nhật số lượng
  updateQuantity(cartItemId: number, quantity: number): Observable<Cart> {
    // return this.http.put<Cart>(`${this.apiUrl}/update/${cartItemId}`, { quantity }).pipe(
    //   tap((data: Cart) => this.cart.set(data))
    // );

    return this.http.put<Cart>(`${this.apiUrl}/update/${cartItemId}?quantity=${quantity}`, {}).pipe(
      tap((data: Cart) => this.cart.set(data))
    );
  }

  // 4. Xóa sản phẩm
  removeItem(cartItemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/remove/${cartItemId}`).pipe(
      tap((data: Cart) => this.cart.set(data))
    );
  }
}