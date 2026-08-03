export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

// Định nghĩa Product rút gọn bên trong OrderItem
export interface OrderProduct {
  id: number;
  name: string;
  sku: string;
  image: string;
  price: number;
}

export interface OrderItem {
  id?: number;
  
  // QUAN TRỌNG: Backend trả về object 'product', không phải 'productId'
  product: OrderProduct; 
  
  productName: string;
  productImage?: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  totalPrice: number;
  paymentMethod: string;
  status: OrderStatus;
  orderDate: string;
  orderItems: OrderItem[];
}