export interface WishlistItem {
  id: number;           // ID của dòng wishlist (dùng để xóa)
  productId: number;    // ID của sản phẩm (dùng để click xem chi tiết)
  productName: string;  // Tên sản phẩm (Backend trả về productName)
  price: number;
  image: string;
  categoryName?: string; // Tên danh mục (Backend trả về categoryName)
}