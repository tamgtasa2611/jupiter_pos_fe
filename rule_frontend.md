# PHÂN TÍCH CHI TIẾT SOURCE CODE FRONTEND

## 1. Tổng quan kiến trúc

- **Framework**: Next.js (React 19)
- **Ngôn ngữ**: JavaScript (ES6+)
- **UI Library**: Ant Design 5, TailwindCSS
- **Quản lý trạng thái**: Recoil
- **Quản lý API**: Axios (cấu hình tại [`src/utils/request.js`](src/utils/request.js))
- **Hỗ trợ mobile**: Có giao diện riêng cho mobile (`/m`), sử dụng middleware để redirect.
- **Tổ chức code**: Theo module, chia rõ các domain (bán hàng, hàng hóa, khách hàng, nhân viên, thống kê, ...).

---

## 2. Cấu trúc thư mục chính

```
src/
  app/                # Routing Next.js, chia layout cho admin, mobile, login, ...
    admin/            # Trang quản trị (dashboard, bán hàng, hàng hóa, ...)
    m/                # Giao diện mobile
    dang-nhap/        # Trang đăng nhập
    globals.css       # CSS toàn cục (Ant Design + Tailwind)
    layout.js         # Layout gốc
  components/         # Tất cả component UI chia theo domain
    admin/            # Component cho admin (bán hàng, hàng hóa, ...)
    common/           # Component dùng chung (login, register, ...)
  atoms/              # State management với Recoil
  config/             # Cấu hình theme Ant Design
  hooks/              # Custom hooks chia theo domain
  requests/           # Hàm gọi API chia theo nghiệp vụ (auth, user, ...)
  utils/              # Tiện ích chung (request.js, utils.js)
public/               # Ảnh, file tĩnh, index.html, middleware.js
```

---

## 3. Phân tích các thành phần chính

### 3.1. Routing & Layout

- **Next.js App Router**: Sử dụng thư mục `src/app/` để định nghĩa các route.
- **Layout**:
  - [`src/app/layout.js`](src/app/layout.js): Layout gốc, cấu hình theme, font, Ant Design.
  - [`src/app/admin/layout.jsx`](src/app/admin/layout.jsx), [`src/app/m/admin/layout.jsx`](src/app/m/admin/layout.jsx): Layout riêng cho admin và mobile.
- **Middleware**: [`public/middleware.js`](public/middleware.js) tự động redirect giữa desktop/mobile.

### 3.2. UI & Style

- **Ant Design**: Sử dụng toàn bộ hệ sinh thái Ant Design 5 (Button, Table, Modal, Form, ...).
- **TailwindCSS**: Dùng cho utility class, custom style.
- **Theme**: Cấu hình tại [`src/config/themeConfig.js`](src/config/themeConfig.js).
- **globals.css**: Định nghĩa biến màu, custom scrollbar, responsive, ... tại [`src/app/globals.css`](src/app/globals.css).

### 3.3. Quản lý trạng thái

- **Recoil**: Sử dụng cho state toàn cục (ví dụ: trạng thái mobile, thông tin user).
- **atoms/common.js**: Định nghĩa các atom dùng chung.

### 3.4. Gọi API

- **Axios**: Cấu hình instance tại [`src/utils/request.js`](src/utils/request.js) (tự động gắn token, xử lý lỗi chung).
- **requests/**: Chứa các hàm gọi API chia theo domain (auth, user, ...).

### 3.5. Các module nghiệp vụ

#### 3.5.1. Bán hàng (`admin/ban-hang/`)

- **MainSellingPage.jsx**: Trang chính bán hàng, hiển thị sản phẩm, chọn khách, tạo đơn.
- **ProductsSection.jsx**: Lọc, tìm kiếm, chọn sản phẩm.
- **OrderSummary.jsx**: Tính tổng tiền, số lượng, hiển thị giỏ hàng.
- **CustomerInfo.jsx**: Chọn hoặc thêm khách hàng cho đơn.

#### 3.5.2. Hàng hóa (`admin/hang-hoa/`)

- **ProductTable.jsx**: Bảng danh sách sản phẩm, filter, sort, thao tác (xem, sửa, xóa).
- **AddProductModal.jsx**: Thêm sản phẩm mới (form, upload ảnh).
- **ImportProductsModal.jsx**: Import sản phẩm từ Excel, kiểm tra lỗi, preview dữ liệu.
- **ProductDetailPage.jsx**: Trang chi tiết sản phẩm (thông tin, tồn kho, lịch sử, ...).

#### 3.5.3. Đơn hàng (`admin/don-hang/`)

- **OrderTable.jsx**: Danh sách đơn hàng, filter, sort, thao tác.
- **OrderActions.jsx**: Thêm đơn, xuất Excel/PDF, in danh sách.

#### 3.5.4. Khách hàng (`admin/khach-hang/`)

- **CustomersMainPage.jsx**: Quản lý khách hàng, thống kê, thêm/sửa/xóa.
- **EditCustomerModal.jsx**: Sửa thông tin khách hàng.

#### 3.5.5. Thống kê (`admin/thong-ke/`)

- **MainStatisticsPage.jsx**: Trang tổng hợp thống kê.
- **SalesReport.jsx**, **DailyReport.jsx**: Thống kê doanh số, báo cáo ngày.
- **Top10Products.jsx**, **Top10Customers.jsx**: Top sản phẩm/khách hàng nổi bật.

#### 3.5.6. Trang chủ admin (`admin/trang-chu/`)

- **AdminDashboard.jsx**: Dashboard tổng quan, hiển thị TodaySummary, SalesSummary, Top10Products, Top10Customers.

#### 3.5.7. Đăng nhập/Đăng ký (`common/login/`, `common/register/`)

- **LoginForm.jsx**, **RegisterForm.jsx**: Form đăng nhập, đăng ký, validate, gọi API, chuyển trang.

### 3.6. Mobile

- **src/app/m/**: Giao diện mobile, layout riêng, sử dụng lại nhiều component từ desktop.
- **MobileNavBar**, **MobileMenu**: Thanh điều hướng, menu cho mobile.

---

## 4. Tiện ích & Best Practice

- **Tách biệt rõ ràng UI, logic, API**: Dễ bảo trì, mở rộng.
- **Sử dụng mock data cho demo**: Nhiều component có mock data, dễ chuyển sang gọi API thực tế.
- **Custom hook**: Đặt tại `hooks/`, ví dụ: useIsMobile, useFetchProducts.
- **Quản lý đường dẫn import bằng alias**: Định nghĩa trong [`jsconfig.json`](jsconfig.json) (`@components/`, `@utils/`, ...).

---

## 5. Đặc điểm nổi bật

- **Responsive**: Hỗ trợ tốt cả desktop và mobile, tự động redirect.
- **UI hiện đại**: Kết hợp Ant Design và TailwindCSS.
- **Quản lý trạng thái hiệu quả**: Recoil.
- **Quản lý API tập trung**: Dễ mở rộng, bảo trì.
- **Tổ chức code rõ ràng theo domain nghiệp vụ**.

---

## 6. Kết luận

Source code frontend này được tổ chức tốt, dễ mở rộng, dễ bảo trì, áp dụng các best practice hiện đại của Next.js và React. Hệ thống đã có đầy đủ các module nghiệp vụ cơ bản cho một phần mềm quản lý bán hàng (POS) hiện đại.
