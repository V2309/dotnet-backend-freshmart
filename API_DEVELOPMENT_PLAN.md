# 📋 KẾ HOẠCH THIẾT KẾ & PHÁT TRIỂN API HỆ THỐNG FRESHMART POS
### (Chuẩn hóa 100% theo Giao diện Frontend React + Database PostgreSQL)

> **Hệ thống**: FreshMart Supermarket POS & Management System  
> **Frontend Codebase**: React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Recharts  
> **Backend Database**: PostgreSQL (`database/schema.sql`)  
> **Mục tiêu**: Lập kế hoạch chi tiết từng API tương ứng với từng Màn hình, Component, State & Action trên Frontend; Định rõ quy trình làm việc từng bước và bộ quy tắc code.

---

## 📑 MỤC LỤC
1. [Bộ quy tắc chuẩn hóa Code & API (Rule Code)](#1-bộ-quy-tắc-chuẩn-hóa-code--api-rule-code)
2. [Quy trình làm việc từng bước (Confirmation Workflow: Làm ➔ Test ➔ Chờ User "OK" ➔ Tiếp tục)](#2-quy-trình-làm-việc-từng-bước-step-by-step-confirmation-workflow)
3. [Bảng ma trận ánh xạ Frontend ↔ Backend ↔ API Priority](#3-bảng-ma-trận-ánh-xạ-frontend--backend--api-priority)
4. [Chi tiết thiết kế API theo từng Màn hình Frontend (Thứ tự ưu tiên - Dashboard sau cùng)](#4-chi-tiết-thiết-kế-api-theo-từng-màn-hình-frontend)
   - [Phase 1: Đăng nhập & Quản lý Nhân viên (`/login`, `/employees`)](#phase-1-đăng-nhập--quản-lý-nhân-viên-login-employees)
   - [Phase 2: Danh mục & Nhà cung cấp (`CATEGORIES`, `suppliers`)](#phase-2-danh-mục--nhà-cung-cấp-categories-suppliers)
   - [Phase 3: Quản lý Hàng hóa & Quét Barcode (`/products`)](#phase-3-quản-lý-hàng-hóa--quét-barcode-products)
   - [Phase 4: Ca làm việc & Két tiền Thu ngân (`/pos`, `/employees`)](#phase-4-ca-làm-việc--két-tiền-thu-ngân-pos-employees)
   - [Phase 5: Bán hàng POS, Giỏ hàng & Thanh toán (`/pos`)](#phase-5-bán-hàng-pos-giỏ-hàng--thanh-toán-pos)
   - [Phase 6: Quản lý Đơn nhập hàng từ NCC (`/purchases`)](#phase-6-quản-lý-đơn-nhập-hàng-từ-ncc-purchases)
   - [Phase 7: Quản lý Tồn kho & Kiểm kê (`/inventory`)](#phase-7-quản-lý-tồn-kho--kiểm-kê-inventory)
   - [Phase 8: Quản lý Khách hàng & Tích điểm VIP (`/customers`)](#phase-8-quản-lý-khách-hàng--tích-điểm-vip-customers)
   - [Phase 9: Thông báo & Cảnh báo Tức thời (`Header`, `Notifications`)](#phase-9-thông-báo--cảnh-báo-tức-thời-header-notifications)
   - [Phase 10: Báo cáo Thống kê Doanh thu & Lợi nhuận (`/reports`)](#phase-10-báo-cáo-thống-kê-doanh-thu--lợi-nhuận-reports)
   - [Phase 11: Tổng quan Dashboard & KPIs Realtime (`/dashboard` - SAU CÙNG)](#phase-11-tổng-quan-dashboard--kpis-realtime-dashboard---sau-cùng)

---

## 1. 🛡️ BỘ QUY TẮC CHUẨN HÓA CODE & API (RULE CODE)

Mọi API được xây dựng trong hệ thống phải tuân thủ nghiêm ngặt các quy tắc sau:

### 1.1. Chuẩn RESTful API & Đặt tên Endpoint
- **URL Path**: Sử dụng danh từ số nhiều, chữ thường, nối từ bằng dấu gạch ngang (kebab-case).  
  - Ví dụ: `GET /api/v1/purchase-orders`, `POST /api/v1/orders/checkout`
- **HTTP Methods**:
  - `GET`: Truy vấn dữ liệu (không làm thay đổi state).
  - `POST`: Tạo mới tài nguyên hoặc hành động xử lý nghiệp vụ (Checkout, Mở/Đóng ca, Nhập hàng).
  - `PUT`: Cập nhật toàn bộ thông tin tài nguyên.
  - `PATCH`: Cập nhật một phần thuộc tính (ví dụ: đổi trạng thái `status`, điều chỉnh kho `stock`).
  - `DELETE`: Xóa tài nguyên (Kiểm tra ràng buộc khóa ngoại trước khi xóa).

### 1.2. Định dạng Response chuẩn (Standard Response Format)
Tất cả các API trả về định dạng JSON thống nhất, khớp với Types của Frontend:

#### Thành công (`200 OK`, `201 Created`):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy danh sách sản phẩm thành công",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```

#### Thất bại (`400`, `401`, `403`, `404`, `409`, `422`, `500`):
```json
{
  "success": false,
  "statusCode": 400,
  "errorCode": "INVALID_STOCK_QUANTITY",
  "message": "Số lượng tồn kho không đủ để xuất bán",
  "errors": [
    {
      "field": "quantity",
      "message": "Số lượng yêu cầu (10) vượt quá tồn kho hiện tại (5)"
    }
  ],
  "timestamp": "2026-09-12T18:00:00.000Z"
}
```

### 1.3. Mã HTTP Status Code chuẩn
| Code | Ý nghĩa | Khi nào áp dụng |
| :--- | :--- | :--- |
| **200 OK** | Thành công | Trả về dữ liệu `GET`, cập nhật `PUT/PATCH`, xóa mềm `DELETE` |
| **201 Created** | Tạo mới thành công | Tạo hóa đơn bán hàng, tạo đơn nhập, mở ca làm việc |
| **204 No Content** | Xóa hoàn toàn | Xóa cứng dữ liệu thành công không cần body |
| **400 Bad Request** | Lỗi dữ liệu đầu vào | Thiếu trường bắt buộc, sai định dạng UUID, dữ liệu không hợp lệ |
| **401 Unauthorized** | Chưa xác thực | Chưa đăng nhập hoặc Token hết hạn |
| **403 Forbidden** | Không có quyền | Thu ngân truy cập màn hình cấu hình nhân sự / báo cáo tài chính |
| **404 Not Found** | Không tìm thấy | ID không tồn tại trong CSDL |
| **409 Conflict** | Xung đột dữ liệu | Trùng Barcode, SKU, Số điện thoại hoặc Mã đơn hàng |
| **422 Unprocessable** | Vi phạm nghiệp vụ | Xuất kho âm, hủy đơn hàng đã hoàn tất quá thời hạn |
| **500 Server Error** | Lỗi máy chủ | Lỗi cơ sở dữ liệu, lỗi ngoại lệ hệ thống |

### 1.4. Quy tắc Database & Transaction
- **Ánh xạ Tên trường (Naming Conversion)**:
  - Database PostgreSQL: `snake_case` (ví dụ: `cost_price`, `sell_price`, `total_spent`, `created_at`).
  - Frontend TypeScript & JSON: `camelCase` (ví dụ: `costPrice`, `sellPrice`, `totalSpent`, `createdAt`).
  - Backend tự động map 2 chiều giữa DB và API JSON response.
- **Database Transaction (`BEGIN ... COMMIT / ROLLBACK`)**:
  - Bắt buộc áp dụng Transaction cho các nghiệp vụ đa bảng:
    1. **Tạo hóa đơn POS**: Tạo `orders` + tạo `order_items` + tích điểm `customers` + ghi nhận `loyalty_transactions`. (Trigger DB `deduct_stock_on_sale` tự trừ kho).
    2. **Nhập hàng NCC**: Đổi trạng thái PO sang `received` + Trigger DB `update_stock_on_receive` tự cập nhật kho & giá vốn.
    3. **Kiểm kê kho**: Tạo bản ghi `inventory_adjustments` + cập nhật `products.stock`.
- **Bảo mật & Tìm kiếm tiếng Việt**:
  - Sử dụng Parameterized Query 100% chống SQL Injection.
  - Sử dụng hàm `unaccent()` và index `pg_trgm` cho tìm kiếm không dấu (Tên sản phẩm, barcode, tên khách hàng).

---

## 2. 🔄 QUY TRÌNH LÀM VIỆC TỪNG BƯỚC (STEP-BY-STEP CONFIRMATION WORKFLOW)

Để đảm bảo code chạy trơn tru, không lỗi và ăn khớp hoàn toàn với giao diện:

```
┌─────────────────────────────────────────────────────────────┐
│               QUY TRÌNH TRIỂN KHAI TỪNG API                 │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
 1. TIẾP NHẬN & PHÂN TÍCH API THEO THỨ TỰ ƯU TIÊN
    - Đối chiếu giao diện Frontend (State, Types, Form, Event handler).
    - Đối chiếu Database Schema (`database/schema.sql`) & Triggers.
                             │
                             ▼
 2. TRIỂN KHAI CODE BACKEND & TÍCH HỢP FRONTEND
    - Viết Route, Controller, Service, DTO Validation.
    - Xử lý Database Query, Transaction, Error Catching.
    - Cập nhật API Service phía Frontend để thay thế Mock Data.
                             │
                             ▼
 3. TỰ KIỂM TRA TOÀN DIỆN (SELF-TEST & VALIDATION)
    - Test Case thành công (Happy path) qua Curl / Postman.
    - Test Case lỗi (Validation error, Not Found, Duplicate SKU, v.v.).
    - Kiểm tra giao diện Frontend render đúng dữ liệu thực tế.
                             │
                             ▼
 4. BÁO CÁO KẾT QUẢ CHO NGƯỜI DÙNG (USER REVIEW REQUEST)
    - Cung cấp: Endpoint, Method, Input/Output mẫu, Video/Ảnh minh chứng test.
                             │
                             ▼
 5. CHỜ PHẢN HỒI TỪ USER
    ├── Nếu User yêu cầu điều chỉnh ──► Fix & Test lại ngay.
    └── Khi User gõ "OK" / "Đồng ý" ──► Mới bắt đầu làm API tiếp theo!
```

---

## 3. 📊 BẢNG MA TRẬN ÁNH XẠ FRONTEND ↔ BACKEND ↔ API PRIORITY

| Thứ tự Ưu tiên | Màn hình Frontend | Component / File React | Bảng CSDL PostgreSQL | Types & Models |
| :--- | :--- | :--- | :--- | :--- |
| **Ưu tiên 1** | Trang Đăng nhập & Nhân viên | `LoginPage.tsx`, `EmployeesView.tsx` | `employees` | `User`, `EmployeeItem` |
| **Ưu tiên 2** | Danh mục & Nhà cung cấp | Filter tabs trong `ProductsView`, `PurchasesView` | `categories`, `suppliers` | `CATEGORIES`, `Supplier` |
| **Ưu tiên 3** | Quản lý Sản phẩm | `ProductsView.tsx`, `QuickSearchModal.tsx` | `products` | `Product`, `StockStatus` |
| **Ưu tiên 4** | Ca làm việc Thu ngân | `POSView.tsx`, `EmployeesView.tsx` | `shifts` | `CashierShift` |
| **Ưu tiên 5** | Quầy POS & Đơn bán hàng | `POSView.tsx`, `PaymentModal.tsx`, `HeldOrdersModal.tsx`, `ReceiptModal.tsx` | `orders`, `order_items` | `Order`, `OrderItem`, `CartItem`, `HeldCartData` |
| **Ưu tiên 6** | Quản lý Nhập hàng | `PurchasesView.tsx` | `purchase_orders`, `purchase_order_items` | `SupplierPurchase` |
| **Ưu tiên 7** | Quản lý Kho & Kiểm kê | `InventoryView.tsx` | `inventory_adjustments`, `products` | `Product` |
| **Ưu tiên 8** | Khách hàng & Tích điểm | `CustomersView.tsx`, `QuickAddCustomerModal.tsx` | `customers`, `loyalty_transactions` | `Customer` |
| **Ưu tiên 9** | Thông báo & Cảnh báo | `Header.tsx`, Chuông thông báo | `notifications` | `NotificationItem` |
| **Ưu tiên 10** | Báo cáo Doanh thu | `ReportsView.tsx` | `daily_report_snapshots`, `hourly_sales`, `category_sales_summary` | Recharts data, `Order` |
| **Ưu tiên 11** | Tổng quan Dashboard (**SAU CÙNG**) | `DashboardView.tsx` | Tổng hợp toàn bộ các bảng | Full Dashboard KPI State |

---

## 4. 📐 CHI TIẾT THIẾT KẾ API THEO TỪNG MÀN HÌNH FRONTEND

---

### Phase 1: Đăng nhập & Quản lý Nhân viên (`/login`, `/employees`)
> **Frontend Files**: [LoginPage.tsx](file:///d:/Projects/freshmart/src/pages/Login/LoginPage.tsx), [EmployeesView.tsx](file:///d:/Projects/freshmart/src/components/EmployeesView.tsx), [AuthContext.tsx](file:///d:/Projects/freshmart/src/context/AuthContext.tsx)  
> **Database**: Table `employees` (`id`, `code`, `name`, `phone`, `email`, `role`, `pin_hash`, `is_active`, `hired_date`, `notes`)

#### 1.1. API Xác thực & Đăng nhập (Phục vụ `LoginPage.tsx` & Quét mã PIN tại POS)
  - **`POST /api/v1/auth/login`**: Đăng nhập bằng Email/Tài khoản + Mật khẩu (Trang quản trị).
    - *Request Body*: `{ email: string, password: string, remember?: boolean }`
    - *Response*: `{ token: string, user: { id: string, name: string, role: 'admin' | 'cashier' | 'store_manager' | 'warehouse_staff', email: string } }`
  - **`POST /api/v1/auth/login-pin`**: Đăng nhập nhanh tại POS bằng Mã PIN (`pin_hash`).
    - *Request Body*: `{ employeeCode: string, pin: string }`
    - *Response*: `{ token: string, user: User, activeShift: CashierShift | null }`
  - **`GET /api/v1/auth/me`**: Lấy thông tin phiên làm việc hiện tại của nhân viên.
  - **`POST /api/v1/auth/logout`**: Đăng xuất khỏi hệ thống.

#### 1.2. API Quản lý Nhân viên (Phục vụ `EmployeesView.tsx`)
- **`GET /api/v1/employees`**: Lấy danh sách nhân viên kèm thông tin ca trực và doanh số ca.
  - *Frontend State mapped*: `staffList: EmployeeItem[]`, KPIs (`totalStaff`, `activeStaffCount`, `totalRevenue`).
  - *Query Params*: `search` (tên, SĐT, mã ID), `role`, `status` (`active` | `offline`).
- **`POST /api/v1/employees`**: Tạo mới nhân sự (`handleCreateStaff`).
  - *Request Body*: `{ name: string, role: string, phone: string, shift: string, email?: string, pin?: string }`
- **`PUT /api/v1/employees/:id`**: Sửa thông tin nhân viên.
- **`PATCH /api/v1/employees/:id/status`**: Khóa / Kích hoạt tài khoản nhân viên.
- **`PATCH /api/v1/employees/:id/reset-pin`**: Cấp lại mã PIN cho thu ngân.

---

### Phase 2: Danh mục & Nhà cung cấp (`CATEGORIES`, `suppliers`)
> **Frontend Files**: [mockData.ts](file:///d:/Projects/freshmart/src/data/mockData.ts) (`CATEGORIES`), [ProductsView.tsx](file:///d:/Projects/freshmart/src/components/ProductsView.tsx), [PurchasesView.tsx](file:///d:/Projects/freshmart/src/components/PurchasesView.tsx)  
> **Database**: Tables `categories`, `suppliers`

#### 2.1. API Danh mục hàng hóa (Categories)
- **`GET /api/v1/categories`**: Lấy danh sách nhóm hàng kèm icon Lucide & số lượng sản phẩm (`categoriesWithCount`).
  - *Response Data*: `[{ id: 'drinks', slug: 'drinks', name: 'Đồ uống', icon: 'Coffee', sortOrder: 1, productCount: 5 }, ...]`
- **`POST /api/v1/categories`**: Thêm danh mục mới.
- **`PUT /api/v1/categories/:id`**: Cập nhật thông tin danh mục.
- **`DELETE /api/v1/categories/:id`**: Xóa danh mục (kiểm tra nếu còn sản phẩm thì báo lỗi `409 Conflict`).

#### 2.2. API Nhà cung cấp (Suppliers)
- **`GET /api/v1/suppliers`**: Lấy danh sách NCC phục vụ dropdown chọn NCC khi nhập hàng (`PurchasesView.tsx`) hoặc tạo sản phẩm (`ProductsView.tsx`).
- **`GET /api/v1/suppliers/:id`**: Chi tiết NCC + Lịch sử các đơn nhập hàng.
- **`POST /api/v1/suppliers`**: Thêm NCC mới (`code`, `name`, `phone`, `contactName`, `address`, `taxCode`).
- **`PUT /api/v1/suppliers/:id`**: Cập nhật NCC.

---

### Phase 3: Quản lý Hàng hóa & Quét Barcode (`/products`)
> **Frontend Files**: [ProductsView.tsx](file:///d:/Projects/freshmart/src/components/ProductsView.tsx), [QuickSearchModal.tsx](file:///d:/Projects/freshmart/src/components/QuickSearchModal.tsx), [AppContext.tsx](file:///d:/Projects/freshmart/src/context/AppContext.tsx)  
> **Database**: Table `products` (`id`, `sku`, `barcode`, `name`, `category_id`, `supplier_id`, `unit`, `cost_price`, `sell_price`, `stock`, `min_stock`, `image_url`, `status`, `is_active`)  
> **Frontend Type**: `Product` (`id`, `sku`, `barcode`, `name`, `category`, `unit`, `costPrice`, `sellPrice`, `stock`, `minStock`, `image`, `status`, `supplier`)

#### 3.1. API Sản phẩm & Danh mục hàng hóa
- **`GET /api/v1/products`**: Danh sách sản phẩm hỗ trợ bộ lọc và phân trang hoàn chỉnh trên giao diện:
  - *Query Params*: 
    - `search`: Tìm theo Tên tiếng Việt không dấu (`unaccent`), SKU, Barcode, hoặc Tên NCC.
    - `category`: Lọc theo slug danh mục (`drinks`, `noodles`, `all`, v.v.).
    - `status`: Lọc theo `in_stock`, `low_stock`, `out_of_stock`.
    - `sortBy`: Sắp xếp theo `name_asc`, `name_desc`, `price_asc`, `price_desc`, `stock_asc`, `stock_desc`.
    - `page`, `limit`.
  - *Response*: Trả về danh sách `Product[]` + KPI Summary (`totalCount`, `totalInventoryValue`, `lowStockCount`, `outOfStockCount`).
- **`GET /api/v1/products/barcode/:barcode`**: Quét mã vạch trực tiếp từ máy quét Barcode hoặc Modal Quick Search (`Cmd+K`).
- **`GET /api/v1/products/:id`**: Lấy chi tiết 1 sản phẩm.
- **`POST /api/v1/products`**: Thêm sản phẩm mới (`handleAddProduct`):
  - *Request Body*: `{ name, category, sku, barcode, unit, costPrice, sellPrice, stock, minStock, supplier, image }`
- **`PUT /api/v1/products/:id`**: Cập nhật sản phẩm (`handleUpdateProduct`).
- **`PATCH /api/v1/products/:id/quick-stock`**: Cập nhật nhanh số lượng kho từ bảng sản phẩm (`onAdjustStock`).
- **`DELETE /api/v1/products/:id`**: Xóa sản phẩm.
- **`POST /api/v1/products/bulk-delete`**: Xóa hàng loạt sản phẩm được chọn (`selectedProductIds`).

---

### Phase 4: Ca làm việc & Két tiền Thu ngân (`/pos`, `/employees`)
> **Frontend Files**: [POSView.tsx](file:///d:/Projects/freshmart/src/components/POSView.tsx), [EmployeesView.tsx](file:///d:/Projects/freshmart/src/components/EmployeesView.tsx), [Header.tsx](file:///d:/Projects/freshmart/src/components/Header.tsx)  
> **Database**: Table `shifts` (`id`, `employee_id`, `shift_name`, `start_time`, `end_time`, `starting_cash`, `expected_cash`, `actual_cash`, `total_revenue`, `order_count`, `status`, `notes`)  
> **Frontend Type**: `CashierShift` (`id`, `cashierName`, `shiftName`, `startTime`, `endTime`, `startingCash`, `expectedCash`, `totalRevenue`, `orderCount`, `status`)

#### 4.1. API Quản lý Ca làm việc
- **`GET /api/v1/shifts/current`**: Lấy ca trực hiện tại của thu ngân đăng nhập để hiển thị trên Header và quầy POS.
- **`POST /api/v1/shifts/open`**: Mở ca trực mới khi thu ngân bắt đầu làm việc:
  - *Request Body*: `{ shiftName: string, startingCash: number, notes?: string }`
- **`POST /api/v1/shifts/:id/close`**: Chốt ca làm việc (`handleCloseShift`):
  - *Request Body*: `{ actualCash: number, notes?: string }`
  - *Cơ chế*: Tự động tính chênh lệch giữa `expectedCash` và `actualCash`, cập nhật `status: 'closed'`, đóng ca trực.
- **`GET /api/v1/shifts`**: Lịch sử các ca làm việc (Dành cho Quản lý cửa hàng theo dõi).
- **`GET /api/v1/shifts/:id/report`**: Biên bản tổng kết chi tiết ca làm việc (Doanh thu tiền mặt, VietQR, Thẻ POS, Số lượng đơn).

---

### Phase 5: Bán hàng POS, Giỏ hàng & Thanh toán (`/pos`)
> **Frontend Files**: [POSView.tsx](file:///d:/Projects/freshmart/src/components/POSView.tsx), [PaymentModal.tsx](file:///d:/Projects/freshmart/src/components/PaymentModal.tsx), [HeldOrdersModal.tsx](file:///d:/Projects/freshmart/src/components/HeldOrdersModal.tsx), [ReceiptModal.tsx](file:///d:/Projects/freshmart/src/components/ReceiptModal.tsx), [AppContext.tsx](file:///d:/Projects/freshmart/src/context/AppContext.tsx)  
> **Database**: Tables `orders`, `order_items`, `loyalty_transactions`, `products`, `customers`  
> **Frontend Types**: `Order`, `OrderItem`, `CartItem`, `HeldCartData`, `PaymentMethod` (`cash` | `vietqr` | `pos_card`)

#### 5.1. API Bán hàng & Thanh toán POS (`PaymentModal.tsx`)
- **`POST /api/v1/pos/checkout`**: Xử lý thanh toán hóa đơn (`handleCompleteOrder`):
  - *Request Body*:
    ```json
    {
      "shiftId": "shift-01",
      "customerId": "c-01",
      "customerName": "Chị Mai Lan",
      "customerPhone": "0988 123 456",
      "items": [
        { "productId": "p-01", "productName": "Coca-Cola Sleek Lon 320ml", "sku": "DOU-001", "quantity": 6, "unitPrice": 10000, "discountPercent": 0, "lineTotal": 60000 },
        { "productId": "p-06", "productName": "Bánh ChocoPie Orion", "sku": "BKE-001", "quantity": 1, "unitPrice": 54000, "discountPercent": 0, "lineTotal": 54000 }
      ],
      "subtotal": 182000,
      "discountPercent": 0,
      "discountAmount": 0,
      "vatRate": 8,
      "vatAmount": 14560,
      "total": 196560,
      "paymentMethod": "vietqr",
      "amountReceived": 196560,
      "changeAmount": 0,
      "note": ""
    }
    ```
  - *Database Transaction & Triggers*:
    1. Tạo bản ghi `orders` (Sinh mã `HDxxxx`).
    2. Tạo danh sách `order_items`.
    3. Trigger `deduct_stock_on_sale` tự động trừ tồn kho các món hàng.
    4. Trigger `earn_loyalty_points` tự động tích điểm cho khách hàng và ghi vào `loyalty_transactions`.
    5. Cập nhật doanh thu ca hiện tại `shifts`.
- **`POST /api/v1/pos/vietqr/generate`**: Sinh mã QR VietQR động (chứa số tài khoản, mã hóa đơn `HDxxxx` và số tiền chính xác) để quét thanh toán trên Modal.
- **`GET /api/v1/orders`**: Danh sách đơn hàng đã bán (Lọc theo khoảng ngày, phương thức thanh toán, thu ngân, tìm theo mã đơn).
- **`GET /api/v1/orders/:id`**: Lấy chi tiết đơn hàng phục vụ in hóa đơn (`ReceiptModal.tsx`).
- **`POST /api/v1/orders/:id/cancel`**: Hủy đơn hàng (Yêu cầu quyền Quản lý; Trigger `restore_stock_on_cancel` tự động hoàn trả tồn kho).

#### 5.2. API Lưu tạm Đơn hàng / Hàng chờ POS (`HeldOrdersModal.tsx`)
- **`POST /api/v1/pos/held-orders`**: Lưu tạm đơn hàng đang tính dở (`handleParkCurrentOrder`).
- **`GET /api/v1/pos/held-orders`**: Lấy danh sách các đơn hàng đang chờ phục vụ lại.
- **`DELETE /api/v1/pos/held-orders/:id`**: Xóa đơn hàng chờ (`handleDeleteHeldOrder`).

---

### Phase 6: Quản lý Đơn nhập hàng từ NCC (`/purchases`)
> **Frontend Files**: [PurchasesView.tsx](file:///d:/Projects/freshmart/src/components/PurchasesView.tsx), [AppContext.tsx](file:///d:/Projects/freshmart/src/context/AppContext.tsx)  
> **Database**: Tables `purchase_orders`, `purchase_order_items`, `suppliers`, `products`  
> **Frontend Type**: `SupplierPurchase` (`id`, `code`, `supplierName`, `createdAt`, `expectedDate`, `totalItems`, `totalValue`, `status: 'pending' | 'received' | 'draft'`, `createdBy`)

#### 6.1. API Đơn nhập hàng (Purchases Management)
- **`GET /api/v1/purchase-orders`**: Lấy danh sách đơn nhập hàng:
  - *Frontend State mapped*: `purchases`, KPIs (`totalPOs`, `totalPendingValue`, `totalReceivedValue`, `pendingCount`).
  - *Query Params*: `search` (mã đơn `NH-xxxx`, tên NCC), `status` (`all` | `pending` | `received`).
- **`GET /api/v1/purchase-orders/:id`**: Chi tiết đơn nhập hàng + danh sách từng mặt hàng nhập kho.
- **`POST /api/v1/purchase-orders`**: Tạo đơn đặt hàng NCC mới (`handleCreateOrder`):
  - *Request Body*: `{ supplierId: string, supplierName: string, expectedDate: string, totalItems: number, totalValue: number, items: [{ productId, quantity, unitCost }] }`
- **`PATCH /api/v1/purchase-orders/:id/receive`**: Xác nhận nhập kho thực tế (`handleReceivePurchase`):
  - *Cơ chế*: Chuyển `status` thành `received`. Trigger DB `update_stock_on_receive` tự động cộng dồn số lượng vào `products.stock` và cập nhật giá vốn `cost_price` mới nhất.
  - Tự động sinh thông báo thành công `NotificationItem`.
- **`DELETE /api/v1/purchase-orders/:id`**: Hủy/Xóa đơn nhập hàng nháp.

---

### Phase 7: Quản lý Tồn kho & Kiểm kê (`/inventory`)
> **Frontend Files**: [InventoryView.tsx](file:///d:/Projects/freshmart/src/components/InventoryView.tsx), [AppContext.tsx](file:///d:/Projects/freshmart/src/context/AppContext.tsx)  
> **Database**: Tables `products`, `inventory_adjustments`  
> **Frontend Handlers**: `onAdjustStock` (tăng/giảm số lượng), `onSetExactStock` (nhập số lượng thực tế kiểm kê), Lọc `low` (sắp hết), `out` (đã hết)

#### 7.1. API Kiểm kê & Điều chỉnh Tồn kho
- **`GET /api/v1/inventory/overview`**: Lấy thông tin tổng hợp tình trạng kho cho `InventoryView.tsx`:
  - *KPIs*: `lowStockCount`, `outOfStockCount`, `totalStockValue`, `totalStockItems`.
- **`GET /api/v1/inventory/products`**: Danh sách sản phẩm phục vụ kiểm kho:
  - *Query Params*: `filterMode` (`all` | `low` | `out`), `category`, `search` (Tên, SKU, Barcode, NCC).
- **`POST /api/v1/inventory/adjust`**: Điều chỉnh tăng/giảm hoặc đặt số lượng thực tế (`handleSaveStock` / `handleAdjustStock`):
  - *Request Body*:
    ```json
    {
      "productId": "p-01",
      "reason": "stock_count", // 'stock_count' | 'damage' | 'expiry' | 'return' | 'other'
      "actualStock": 150,
      "note": "Kiểm kê định kỳ cuối ca"
    }
    ```
  - *Cơ chế*: Ghi nhận lịch sử vào bảng `inventory_adjustments`, cập nhật `products.stock`. Trigger `sync_product_status` tự động cập nhật lại `status: in_stock / low_stock / out_of_stock`.
- **`GET /api/v1/inventory/adjustments-history`**: Lịch sử các lần kiểm kê/điều chỉnh kho.

---

### Phase 8: Quản lý Khách hàng & Tích điểm VIP (`/customers`)
> **Frontend Files**: [CustomersView.tsx](file:///d:/Projects/freshmart/src/components/CustomersView.tsx), [QuickAddCustomerModal.tsx](file:///d:/Projects/freshmart/src/components/QuickAddCustomerModal.tsx), [AppContext.tsx](file:///d:/Projects/freshmart/src/context/AppContext.tsx)  
> **Database**: Tables `customers`, `loyalty_transactions`  
> **Frontend Type**: `Customer` (`id`, `code`, `name`, `phone`, `points`, `totalSpent`, `tier: 'Thân thiết' | 'Bạc' | 'Vàng' | 'Kim Cương'`, `lastVisit`)

#### 8.1. API Khách hàng & Thành viên
- **`GET /api/v1/customers`**: Lấy danh sách khách hàng phục vụ `CustomersView.tsx`:
  - *KPIs mapped*: `totalCustomers`, `vipCustomersCount`, `totalPoints`, `totalSpentAll`.
  - *Query Params*: `search` (tên, SĐT, mã `KH-xxx`), `tier` (`all` | `Thân thiết` | `Bạc` | `Vàng` | `Kim Cương`).
- **`GET /api/v1/customers/search-pos`**: Tra cứu nhanh khách hàng tại quầy thu ngân POS bằng SĐT hoặc Tên.
- **`GET /api/v1/customers/:id`**: Chi tiết hồ sơ thành viên + Lịch sử đơn hàng + Lịch sử tích/tiêu điểm (`loyalty_transactions`).
- **`POST /api/v1/customers`**: Tạo khách hàng mới (`handleCreateCustomer` / `QuickAddCustomerModal`):
  - *Request Body*: `{ name: string, phone: string, tier?: string, email?: string, address?: string }`
  - Tự sinh mã `KH-xxx`, tặng điểm chào mừng ban đầu.
- **`PUT /api/v1/customers/:id`**: Cập nhật thông tin khách hàng.
- **`POST /api/v1/customers/:id/redeem-points`**: Đổi điểm thưởng để trừ tiền đơn hàng tại quầy POS.

---

### Phase 9: Thông báo & Cảnh báo Tức thời (`Header`, `Notifications`)
> **Frontend Files**: [Header.tsx](file:///d:/Projects/freshmart/src/components/Header.tsx), [mockData.ts](file:///d:/Projects/freshmart/src/data/mockData.ts) (`INITIAL_NOTIFICATIONS`)  
> **Database**: Table `notifications` (`id`, `title`, `message`, `type: 'warning' | 'info' | 'success'`, `is_read`, `created_at`)  
> **Frontend Type**: `NotificationItem` (`id`, `title`, `message`, `time`, `type`, `read`)

#### 9.1. API Thông báo Hệ thống
- **`GET /api/v1/notifications`**: Lấy danh sách thông báo để hiển thị dropdown chuông thông báo trên Header.
- **`GET /api/v1/notifications/unread-count`**: Đếm số lượng thông báo chưa đọc (`read: false`) để hiển thị Badge đỏ.
- **`PATCH /api/v1/notifications/:id/read`**: Đánh dấu đã đọc 1 thông báo (`handleMarkNotificationRead`).
- **`PATCH /api/v1/notifications/read-all`**: Đánh dấu đã đọc tất cả thông báo (`handleClearAllNotifications`).

---

### Phase 10: Báo cáo Thống kê Doanh thu & Lợi nhuận (`/reports`)
> **Frontend Files**: [ReportsView.tsx](file:///d:/Projects/freshmart/src/components/ReportsView.tsx)  
> **Database**: Tables `daily_report_snapshots`, `hourly_sales`, `category_sales_summary`, `orders`  
> **Frontend Charts**: AreaChart (Doanh thu theo giờ), BarChart (Doanh thu theo ngày trong tuần), PieChart (Tỷ trọng phương thức thanh toán VietQR / Tiền mặt / Quẹt thẻ POS)

#### 10.1. API Báo cáo & Thống kê
- **`GET /api/v1/reports/summary`**: Tổng hợp số liệu tài chính theo mốc thời gian (`timeframe: 'day' | 'week' | 'month' | 'year'`):
  - *Metrics mapped*: `totalRevenue`, `totalVAT`, `totalDiscount`, `grossProfit`, `orderCount`.
- **`GET /api/v1/reports/payment-share`**: Tỷ trọng doanh thu theo từng phương thức thanh toán (`qrTotal`, `cashTotal`, `posTotal`, số lượng đơn mỗi loại) cho PieChart.
- **`GET /api/v1/reports/revenue-trend`**: Dữ liệu doanh thu & VAT theo từng khung giờ trong ngày cho AreaChart (`08:00`, `10:00`, `12:00`, ...).
- **`GET /api/v1/reports/daily-comparison`**: Doanh thu thực tế so với mục tiêu theo từng ngày trong tuần (Thứ 2 ➔ Chủ nhật) cho BarChart.
- **`GET /api/v1/reports/export-excel`**: Xuất báo cáo tài chính ra file Excel.

---

### Phase 11: Tổng quan Dashboard & KPIs Realtime (`/dashboard` - SAU CÙNG)
> **Frontend Files**: [DashboardView.tsx](file:///d:/Projects/freshmart/src/components/DashboardView.tsx)  
> **Lý do triển khai sau cùng**: Dashboard là nơi tổng hợp số liệu từ toàn bộ các phân hệ (Doanh thu bán hàng, Nhập hàng, Trả hàng, Lợi nhuận gộp, Cảnh báo kho, Đơn hàng gần nhất, Ca làm việc). Chỉ khi các API Phase 1 đến 10 hoàn tất, Dashboard mới có đầy đủ nguồn dữ liệu chính xác và tối ưu query.

#### 11.1. API Dashboard Realtime
- **`GET /api/v1/dashboard/kpi-summary`**: Lấy số liệu 4 thẻ KPI đầu trang:
  - Doanh thu bán hàng hôm nay (`totalSalesRevenue`).
  - Giá trị đơn nhập hàng (`totalPurchaseValue`).
  - Lợi nhuận gộp ước tính (`grossProfit`).
  - Giá trị hàng trả / hủy (`totalSalesReturn`).
- **`GET /api/v1/dashboard/sales-purchase-chart`**: Dữ liệu biểu đồ đối chiếu Doanh thu Bán hàng vs Chi phí Nhập hàng theo timeframe (`1D`, `1W`, `1M`, `3M`, `6M`, `1Y`).
- **`GET /api/v1/dashboard/category-sales-pie`**: Cơ cấu doanh thu theo nhóm hàng (`CATEGORY_SALES_SHARE`: Đồ uống, Mì & TP, Sữa, Gia vị, Bánh kẹo).
- **`GET /api/v1/dashboard/recent-transactions`**: Danh sách giao dịch mới nhất (Tab Đơn bán hàng, Đơn nhập hàng).
- **`GET /api/v1/dashboard/low-stock-alert`**: Danh sách mặt hàng chạm ngưỡng tồn kho tối thiểu (`showLowStockAlert`) + Nút nhập hàng nhanh (`onQuickRestock`).

---

## 5. 🚀 BƯỚC KHỞI ĐỘNG TIẾP THEO

Quy trình sẽ được thực hiện tuần tự như sau:
1. **Khởi động**: Triển khai **Phase 1: Đăng nhập & Quản lý Nhân viên (`/login`, `/employees`)**.
2. **Thực thi**: Xây dựng Route, Controller, Service, DTO Validation & kết nối DB.
3. **Kiểm thử**: Chạy test case nội bộ (Happy path & Error case), tích hợp thử với component `LoginPage.tsx` / `EmployeesView.tsx`.
4. **Báo cáo**: Trình bày kết quả kiểm thử cho bạn.
5. **Xác nhận**: **Đợi bạn gõ "OK"** ➔ Tiếp tục chuyển sang **Phase 2 (Categories & Suppliers)**.
