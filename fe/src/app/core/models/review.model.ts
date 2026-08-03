// 1. Interface hứng dữ liệu hiển thị (Khớp với ReviewResponse của Backend)
export interface Review {
  id: number;
  userName: string;   // Tên người đánh giá
  rating: number;     // Số sao (1-5)
  content: string;    // Nội dung
  date: string;       // Ngày tháng (Backend đã format sẵn string)
  avatarChar: string; // Chữ cái đầu làm avatar
isVisible: boolean; // [MỚI]

  productId?: number;
  productName?: string;
  productImage?: string;
}

// 2. Interface gửi dữ liệu lên (Khớp với ReviewRequest của Backend)
export interface ReviewRequest {
  userId: number;
  productId: number;
  rating: number;
  content: string;
}