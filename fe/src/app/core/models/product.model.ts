import { Category } from './category.model';
// 1. Định nghĩa kiểu dữ liệu cho sản phẩm (để code gọn gàng hơn)
export interface Product {
  id: number;
  sku: string;
  quantity: number;
  name: string;
  description: string;
  price: number;
  size: string;
  image: string;
  status: string;
  
  // Backend trả về category object bắt buộc, nên không để dấu ?
  category: Category; 
  
  categoryId?: number; 
}


// export interface Product {
//   id: number;
//   sku: string;
//   quantity: number;
//   name: string;
//   description: string;
//   price: number;
//   size: string;   // Ví dụ: "S,M,L"
//   image: string;  // URL ảnh chính
//   status: string;
  
//   // Object Category đầy đủ
//   category: Category; 
  
//   // Dùng khi gửi dữ liệu lên server
//   categoryId?: number; 
// }