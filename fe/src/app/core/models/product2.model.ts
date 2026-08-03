// src/app/core/models/product.model.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;      // Đường dẫn ảnh (URL hoặc tên file)
  isNew?: boolean;    // Cờ đánh dấu sản phẩm mới
  isSoldOut?: boolean;// Cờ đánh dấu hết hàng


  sku?: string;           // Mã sản phẩm (có thể null)
  size?: string;          // Chuỗi kích thước "S,M,L"
  categoryName?: string;  // Tên danh mục (lưu ý: Backend phải trả về trường này, hoặc trả về object category)
}