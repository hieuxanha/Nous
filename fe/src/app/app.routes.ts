import { Routes } from '@angular/router';

// --- GUARDS ---
import { adminGuard } from './core/guards/admin.guard'; // 1. Import Guard

// --- LAYOUTS ---
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

// --- PUBLIC FEATURES ---
import { HomePageComponent } from './features/public/home/home-page.component';
import { ProductDetailComponent } from './features/public/products/product-detail/product-detail.component';
import { CartPage } from './features/public/cart/cart.page';
import { CheckoutComponent } from './features/public/checkout/checkout.component';
import { OrderSuccessComponent } from './features/public/checkout/order-success.component';
import { WishlistComponent } from './features/public/wishlist/wishlist.component';
import { AboutPageComponent } from './features/public/about/about-page.component';
// --- ACCOUNT & AUTH ---
import { AccountInfoComponent } from './features/public/account/account-info.component';
import { MyOrdersComponent } from './features/public/account/my-orders.component';
import { LoginComponent } from './features/public/auth/login/login.component';
import { RegisterComponent } from './features/public/auth/register/register.component';
import { CategoryProductsComponent } from './features/public/home/CategoryProductsComponent';


import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
// --- ADMIN FEATURES ---
import { CategoryListComponent } from './features/admin/categories/category-list.component';
import { ProductListComponent } from './features/admin/products/product-list.component';
import { ShippingComponent } from './features/admin/shipping/shipping.component';
import { OrdersComponent } from './features/admin/orders/orders.component';
import { CustomersComponent } from './features/admin/users/customers.component';
import { InventoryComponent } from './features/admin/inventory/inventory.component';
import { RolesComponent } from './features/admin/roles/roles.component';
import { ManageReviewsComponent } from './features/admin/manage-reviews/manage-reviews.component';
import {VoucherManagerComponent } from './features/admin/voucher/voucher-manager.component';
import { StatsComponent} from './features/admin/stats/stats.component';


export const routes: Routes = [
  // ============================================
  // 1. PUBLIC ROUTES (Khách hàng)
  // ============================================
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomePageComponent },
      
      // Chi tiết sản phẩm
      // Lưu ý: RouterLink ở MyOrdersComponent phải trỏ về ['/products', id]
      { path: 'products/:id', component: ProductDetailComponent },
      { path: 'category/:id', component: CategoryProductsComponent },
      
      // Giỏ hàng & Thanh toán
      { path: 'cart', component: CartPage },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'checkout/success', component: OrderSuccessComponent },
      
      // Tài khoản (Cần đăng nhập - User Guard nếu có)
      { path: 'account', component: AccountInfoComponent },
      { path: 'account/orders', component: MyOrdersComponent },
      
      // Tiện ích
      { path: 'wishlist', component: WishlistComponent },
      { path: 'about', component: AboutPageComponent },

      // Auth
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },

  // ============================================
  // 2. ADMIN ROUTES (Quản trị viên)
  // ============================================
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard], // 2. Áp dụng Guard bảo vệ ở đây
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      // Quản lý Shop
      { path: 'categories', component: CategoryListComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'shipping', component: ShippingComponent },
      { path: 'reviews', component: ManageReviewsComponent },
      { path: 'coupons', component: VoucherManagerComponent},

      // Quản lý User
      { path: 'customers', component: CustomersComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'stats', component: StatsComponent },
      
      // Dashboard (Tạm thời redirect hoặc tạo component sau)
      { path: 'dashboard', redirectTo: 'products' }, 
    ]
  },
  
  // Xử lý 404 (Tùy chọn)
  { path: '**', redirectTo: '' }
];