// src/app/core/models/cart.model.ts

export interface CartItem {
  id: number;          // ID của CartItem (dùng để xóa/sửa)
  productId: number;   // ID của Product
  name: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  totalPrice: number;

  categoryName?: string; 
  size?: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalCartPrice: number;
  totalItemCount: number;
}