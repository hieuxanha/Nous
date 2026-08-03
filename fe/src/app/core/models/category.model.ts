export interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number; // Số lượng sản phẩm thuộc danh mục (để hiển thị cho đẹp)
  status: 'active' | 'inactive';
    // status?: string;

}