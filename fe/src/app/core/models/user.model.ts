export interface User {
  id?: number;
  email: string;
  fullName: string;      // Frontend dùng
  phone: string;         // Frontend dùng
  
  // Các trường bổ sung
  token?: string;
  role?: string;
  gender?: string;
  avatar?: string;
  address?: string;

  // Trường dự phòng từ Backend (để map dữ liệu cũ nếu cần)
  full_name?: string;
  phone_number?: string;
}