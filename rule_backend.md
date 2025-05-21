# PHÂN TÍCH CHI TIẾT SOURCE CODE BACKEND

## 1. Tổng quan kiến trúc

- **Framework**: Spring Boot (Java)
- **Cấu trúc thư mục**: Theo chuẩn Maven, chia module rõ ràng theo domain (product, order, customer, user, category, ...).
- **ORM**: JPA/Hibernate, cấu hình qua `JpaConfig.java`.
- **Bảo mật**: Spring Security, JWT.
- **Quản lý migration DB**: Liquibase.
- **Cơ sở dữ liệu**: PostgreSQL.

---

## 2. Cấu trúc thư mục chính

```
src/
  main/
    java/
      com/
        jupiter/
          store/
            JupiterStoreApplication.java
            common/
              config/         # Cấu hình chung (Security, JPA, ...)
              dto/            # DTO dùng chung
              exception/      # Xử lý exception
              model/          # Model dùng chung
              security/       # JWT, CustomUserDetails
              utils/          # Tiện ích (SecurityUtils, BeanUtil)
            module/
              HomeController.java
              category/       # Quản lý danh mục
              customer/       # Quản lý khách hàng
              notifications/  # Thông báo
              order/          # Quản lý đơn hàng
              payment/        # Thanh toán
              product/        # Quản lý sản phẩm
              ...
    resources/
      config/
        application.properties
        liquibase/
          master.xml
          data/
            admin.csv
  test/
    java/
      com/
        jupiter/
          store/
            JupiterStoreApplicationTests.java
```

---

## 3. Phân tích các thành phần chính

### 3.1. Cấu hình & Tiện ích

#### 3.1.1. `SecurityConfig.java`

- Cấu hình Spring Security, JWT filter, password encoder.
- Định nghĩa các bean bảo mật, filter chain.

#### 3.1.2. `JpaConfig.java`

- Cấu hình JPA, TransactionManager, các thuộc tính Hibernate.

#### 3.1.3. `application.properties`

- Cấu hình DB, server, security, JWT, Liquibase.

#### 3.1.4. `BeanUtil.java`

- Tiện ích lấy bean từ Spring context ở bất kỳ đâu.

#### 3.1.5. `SecurityUtils.java`

- Tiện ích lấy thông tin user hiện tại từ SecurityContext (userId, username, ...).

---

### 3.2. Domain: Product

#### 3.2.1. `ProductService.java`

- **Chức năng**: CRUD sản phẩm, quản lý category của sản phẩm.
- **Các method chính**:
  - `addProduct(CreateProductDTO)`: Thêm sản phẩm mới, gán category.
  - `updateProduct(Integer, UpdateProductDTO)`: Cập nhật sản phẩm.
  - `search()`: Lấy danh sách sản phẩm.
  - `searchById(Integer)`: Lấy chi tiết sản phẩm theo id.
  - `deleteProduct(Integer)`: Xóa sản phẩm (cascading xóa variant, category).
  - `addCategory(ProductCategoryDTO)`: Thêm category cho sản phẩm.
  - `deleteCategory(ProductCategoryDTO)`: Xóa category khỏi sản phẩm.
- **Sử dụng**: Repository pattern, transactional, kiểm tra quyền qua `currentUserId()`.

#### 3.2.2. `ProductVariantService.java`

- **Chức năng**: Quản lý biến thể sản phẩm (màu, size, ...).
- **Các method chính**:
  - `searchProductVariant(Integer)`: Lấy danh sách variant theo productId.
  - `addProductVariant(Integer, CreateProductVariantDTO)`: Thêm variant.
  - `updateProductVariant(Integer, CreateProductVariantDTO)`: Cập nhật variant.
  - `deleteProductVariant(Integer)`: Xóa variant.
  - Quản lý ảnh variant.

#### 3.2.3. DTOs

- `ProductDTO`, `CreateProductDTO`, `UpdateProductDTO`, ...: Chuẩn hóa dữ liệu truyền giữa client-server.

---

### 3.3. Domain: Order

#### 3.3.1. `OrderService.java`

- **Chức năng**: Quản lý đơn hàng, chi tiết đơn hàng.
- **Các method chính**:
  - `getOrderDetailById(Integer)`: Lấy chi tiết đơn hàng.
  - `getAllUserOrders()`: Lấy tất cả đơn hàng của user hiện tại.
  - `createOrder(Integer)`: Tạo đơn hàng mới.
  - `addProductToOrder(Integer, Integer)`: Thêm sản phẩm vào đơn hàng.
  - `updateQuantityItem(Integer, int)`: Cập nhật số lượng sản phẩm trong đơn.
  - `updateOrderStatus(Integer)`: Cập nhật trạng thái đơn hàng.
  - `deleteOrderItem(Integer)`: Xóa sản phẩm khỏi đơn hàng.
- **Sử dụng**: Kiểm tra quyền qua `currentUserId()`, exception handling.

#### 3.3.2. Model

- `Order`, `OrderDetail`: Mapping với bảng DB, kế thừa `AbstractAuditingEntity` để tự động lưu thông tin tạo/cập nhật.

---

### 3.4. Domain: Customer

#### 3.4.1. `CustomerService.java`

- **Chức năng**: Quản lý khách hàng.
- **Các method chính**:
  - `findAllCustomer()`: Lấy tất cả khách hàng.
  - `addCustomer(CreateCustomerDTO)`: Thêm khách hàng mới.
  - `findCustomer(String)`: Tìm kiếm khách hàng theo keyword.

---

### 3.5. Domain: Category

#### 3.5.1. `CategoryService.java`

- **Chức năng**: Quản lý danh mục sản phẩm.
- **Các method chính**:
  - `addCategory(String)`: Thêm danh mục mới.
  - `updateCategory(Integer, String)`: Cập nhật tên danh mục.
  - `deleteCategory(Integer)`: Xóa danh mục.
  - `search()`: Lấy tất cả danh mục.
  - `searchById(Integer)`: Lấy danh mục theo id.
  - `searchByName(String)`: Tìm kiếm danh mục theo tên.

---

### 3.6. Domain: User

#### 3.6.1. `CustomUserDetailService.java`

- **Chức năng**: Cung cấp thông tin user cho Spring Security.
- **Các method chính**:
  - `loadUserByUsername(String)`: Lấy user từ DB, build `CustomUserDetails` (bao gồm id, phone, password, role).

---

## 4. Bảo mật & Xác thực

- **Spring Security**: Được cấu hình qua `SecurityConfig`.
- **JWT**: Sử dụng filter để xác thực request.
- **CustomUserDetails**: Lưu thông tin user (id, phone, role) để sử dụng trong toàn hệ thống.
- **SecurityUtils**: Lấy userId hiện tại, dùng cho các thao tác ghi nhận người tạo/cập nhật.

---

## 5. Quản lý database

- **JPA/Hibernate**: Mapping entity với bảng DB, sử dụng repository pattern.
- **Liquibase**: Quản lý migration, seed data (admin.csv).
- **Cấu hình**: Trong `application.properties` và `JpaConfig.java`.

---

## 6. Xử lý Exception

- **CustomException**: Xử lý lỗi nghiệp vụ.
- **OpenApiResourceNotFoundException**: Xử lý lỗi không tìm thấy resource.
- **ResponseStatusException**: Trả về mã lỗi HTTP phù hợp.

---

## 7. Đặc điểm nổi bật

- **Tách module rõ ràng**: Dễ mở rộng, bảo trì.
- **Sử dụng DTO**: Đảm bảo bảo mật, chuẩn hóa dữ liệu.
- **Áp dụng best practice Spring Boot**: Service, Repository, Controller, Exception Handling.
- **Bảo mật tốt**: JWT, phân quyền, kiểm tra user hiện tại.
- **Quản lý migration DB chuyên nghiệp**: Liquibase.

---

## 8. Kết luận

Source code backend này được tổ chức tốt, áp dụng các chuẩn mực hiện đại của Spring Boot, dễ mở rộng và bảo trì. Hệ thống đã có đầy đủ các module nghiệp vụ cơ bản cho một hệ thống quản lý bán hàng (POS).
