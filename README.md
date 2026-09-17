<div align="center">
  <br />
  <img src="freshmart/public/readme/readme-hero.webp" alt="FreshMart POS &amp; Management System Banner">
  <br />

  <div>
    <img src="https://img.shields.io/badge/-.NET_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" />
    <img src="https://img.shields.io/badge/-ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" />
    <img src="https://img.shields.io/badge/-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
    <img src="https://img.shields.io/badge/-EF_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  </div>

  <h3 align="center">FreshMart — Supermarket POS &amp; Management System</h3>

  <div align="center">
    A full-stack, production-ready supermarket management platform with a modern POS interface,<br/>
    real-time inventory tracking, sales analytics, employee &amp; shift management, and customer loyalty programs.
  </div>
</div>

---

## 📋 Table of Contents

1. ✨ [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🗂️ [Project Structure](#project-structure)
5. 🤸 [Quick Start](#quick-start)
6. 🌐 [API Overview](#api-overview)
7. 📌 [Environment Variables](#environment-variables)
8. 📝 [Development Notes](#development-notes)

---

## <a name="introduction">✨ Introduction</a>

**FreshMart** is a comprehensive supermarket management system built on a **full-stack** architecture:

- **Backend**: ASP.NET Core 10 Web API with JWT authentication, Entity Framework Core 10, and PostgreSQL.
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 — a modern, responsive POS interface with dark/light theme support.

The system covers all core operations of a real-world supermarket: in-store POS sales, inventory management, supplier purchase orders, employee & shift management, VIP customer loyalty points, and detailed revenue reporting.

---

## <a name="tech-stack">⚙️ Tech Stack</a>

### Backend

| Technology | Purpose |
|---|---|
| **[ASP.NET Core 10](https://dotnet.microsoft.com/)** | Web API framework — minimal API, controller-based routing |
| **[Entity Framework Core 10](https://learn.microsoft.com/ef/core/)** | ORM with auto-migrations and type-safe queries |
| **[Npgsql EF Core Provider](https://www.npgsql.org/efcore/)** | PostgreSQL driver for EF Core |
| **[EFCore.NamingConventions](https://github.com/efcore/EFCore.NamingConventions)** | Auto-maps `PascalCase` C# models to `snake_case` PostgreSQL columns |
| **[JWT Bearer](https://learn.microsoft.com/aspnet/core/security/authentication/jwt-authn)** | Token-based authentication with `Manager` / `Cashier` role authorization |
| **[BCrypt.Net-Next](https://github.com/BcryptNet/bcrypt.net)** | Secure password and cashier PIN hashing |
| **[Scalar](https://scalar.com/)** | Modern API documentation UI replacing Swagger |
| **[PostgreSQL](https://www.postgresql.org/)** | Primary relational database |

### Frontend

| Technology | Purpose |
|---|---|
| **[React 19](https://react.dev/)** | UI framework with React Hooks and concurrent features |
| **[TypeScript 5.8](https://www.typescriptlang.org/)** | Full static typing across the entire frontend |
| **[Vite 6](https://vitejs.dev/)** | Lightning-fast build tool with HMR |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Utility-first CSS framework |
| **[React Router v7](https://reactrouter.com/)** | Client-side routing |
| **[Zustand](https://zustand-demo.pmnd.rs/)** | Lightweight global state management |
| **[Axios](https://axios-http.com/)** | HTTP client for API calls |
| **[Recharts](https://recharts.org/)** | Revenue and analytics charts |
| **[Lucide React](https://lucide.dev/)** | Icon library |
| **[Motion](https://motion.dev/)** | Animation library |

---

## <a name="features">🔋 Features</a>

🔐 **Authentication & Authorization**
Login with username/password via JWT token. Cashiers support **4-digit PIN login** directly at the POS screen. Role-based access: `Manager` (full access) and `Cashier` (POS + shifts only).

🛒 **Point of Sale (POS)**
Full in-store checkout interface with product search, barcode scanning, shopping cart, held orders, and multi-method payment processing (cash / card / VNPAY / VIP points redemption).

📦 **Product & Category Management**
Full CRUD for products including barcode, cost price, selling price, stock quantity, product image, and category assignment. Supports search, filtering, and pagination.

🏭 **Purchase Orders — Supplier Stock Replenishment**
Create purchase orders, receive stock, and automatically update inventory when orders are fulfilled. Track order status: `Pending` → `Received` → `Cancelled`.

📊 **Inventory Management**
Real-time stock tracking, low-stock alerts, and manual inventory adjustments with audit reason logging.

👥 **Employee Management**
Full CRUD for employees, role assignment, and cashier PIN reset. PIN is encrypted with BCrypt.

⏰ **Shift Management**
Open and close work shifts with an opening cash drawer amount. Automatic end-of-shift revenue summary and detailed shift reports.

👤 **Customer Management & VIP Loyalty**
Register customers, accumulate loyalty points on every purchase, and redeem points as discount credit. Tiered membership: `Standard` / `Silver` / `Gold` / `Platinum`.

🔔 **In-App Notifications**
Internal notification system for low-stock alerts, new purchase orders, and status updates.

📈 **Reports & Analytics**
Revenue reports by day / week / month, best-selling products, gross profit, and interactive charts powered by Recharts.

🏠 **Dashboard**
Real-time KPI overview: total revenue, order count, new customers, inventory alerts, and a live revenue trend chart.

---

## <a name="project-structure">🗂️ Project Structure</a>

```
dotnet-backend-freshmart/          # Solution root
│
├── 📁 Controllers/                # REST API controllers
│   ├── AuthController.cs          # POST /api/auth/login, /register, /login-pin
│   ├── ProductsController.cs      # CRUD /api/products
│   ├── CategoriesController.cs    # CRUD /api/categories
│   ├── OrdersController.cs        # POST /api/orders/checkout, GET order history
│   ├── PosController.cs           # Barcode lookup, held orders
│   ├── InventoryController.cs     # Stock tracking & adjustments
│   ├── PurchaseOrdersController.cs # Supplier purchase orders
│   ├── EmployeesController.cs     # Employee management
│   ├── CustomersController.cs     # Customer registration & loyalty points
│   ├── ShiftsController.cs        # Shift open / close / report
│   ├── SuppliersController.cs     # Supplier CRUD
│   ├── ReportsController.cs       # Revenue & profit reports
│   └── NotificationsController.cs # System notifications
│
├── 📁 Models/                     # EF Core entity models
│   ├── Product.cs
│   ├── Category.cs
│   ├── Order.cs / OrderItem.cs
│   ├── PurchaseOrder.cs / PurchaseOrderItem.cs
│   ├── Employee.cs
│   ├── Customer.cs
│   ├── Shift.cs
│   ├── Supplier.cs
│   ├── InventoryAdjustment.cs
│   ├── Notification.cs
│   └── Enums/                     # PaymentMethod, OrderStatus, ShiftStatus, Role...
│
├── 📁 Services/                   # Business logic layer
│   ├── AuthService.cs             # JWT + BCrypt authentication
│   ├── JwtTokenService.cs         # Token generation & validation
│   ├── ProductService/
│   ├── OrderService/              # Checkout logic + VIP points
│   ├── ShiftService/
│   ├── CustomerService/           # Points accrual & tier management
│   ├── ReportService/
│   └── ...                        # One folder per service domain
│
├── 📁 DTOs/                       # Request / response data transfer objects
├── 📁 Config/                     # ServiceConfig — DI, CORS, JWT, DB registration
├── 📁 Data/                       # AppDbContext (EF Core)
├── 📁 Migrations/                 # EF Core database migrations
├── 📁 Middleware/                 # ExceptionHandlingMiddleware (global error handler)
├── 📁 docs/                       # API design docs & coding conventions
│   ├── API_DEVELOPMENT_PLAN.md
│   └── api_convention.txt
│
├── appsettings.json               # Runtime config (gitignored)
├── appsettings.example.json       # Config template
├── Program.cs                     # App bootstrap & middleware pipeline
│
└── 📁 freshmart/                  # React Frontend (Vite)
    ├── 📁 src/
    │   ├── 📁 components/         # UI components
    │   │   ├── POSView.tsx         # POS checkout interface
    │   │   ├── DashboardView.tsx   # Dashboard & KPI widgets
    │   │   ├── ProductsView.tsx    # Product management grid
    │   │   ├── InventoryView.tsx   # Inventory tracking
    │   │   ├── ReportsView.tsx     # Analytics & charts
    │   │   ├── ShiftsView.tsx      # Shift management
    │   │   ├── CustomersView.tsx   # Customer & VIP loyalty
    │   │   ├── PaymentModal.tsx    # Checkout payment flow
    │   │   └── ...
    │   ├── 📁 pages/              # Route-level page components
    │   ├── 📁 services/           # Axios API service layer
    │   ├── 📁 stores/             # Zustand global state stores
    │   ├── 📁 types/              # TypeScript interfaces & enums
    │   └── 📁 utils/              # Utility / helper functions
    ├── package.json
    └── vite.config.ts
```

---

## <a name="quick-start">🤸 Quick Start</a>

### Prerequisites

Make sure you have the following installed:

- **[.NET 10 SDK](https://dotnet.microsoft.com/download)** — Backend runtime & tooling
- **[Node.js](https://nodejs.org/)** v18 or higher — For the frontend
- **[npm](https://www.npmjs.com/)** or **[Yarn](https://yarnpkg.com/)**
- **[PostgreSQL](https://www.postgresql.org/)** — Running locally or via a cloud provider (Neon, Supabase, Railway)
- **EF Core CLI**: `dotnet tool install --global dotnet-ef`

---

### Backend Setup

**1. Clone the repository**

```bash
git clone https://github.com/your-username/dotnet-backend-freshmart.git
cd dotnet-backend-freshmart
```

**2. Configure app settings**

```bash
cp appsettings.example.json appsettings.json
```

Fill in your real values (see [Environment Variables](#environment-variables) below).

**3. Apply database migrations**

```bash
dotnet ef database update
```

**4. Start the development server**

```bash
dotnet run
```

The API will be available at **`http://localhost:5062`**.  
Interactive API docs (Scalar) are available at **`http://localhost:5062/scalar`** in Development mode.

---

### Frontend Setup

```bash
cd freshmart
npm install
npm run dev
```

The frontend will be available at **`http://localhost:3000`**.

---

### Useful Scripts

#### Backend (dotnet CLI)

| Command | Description |
|---|---|
| `dotnet run` | Start the backend server |
| `dotnet watch run` | Start with hot-reload |
| `dotnet build` | Compile the project |
| `dotnet ef database update` | Apply pending migrations |
| `dotnet ef migrations add <Name>` | Create a new migration |
| `dotnet ef database drop` | Drop the entire database |

#### Frontend (npm)

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build the production bundle |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run TypeScript type checks |
| `npm run clean` | Remove the `dist/` folder |

---

## <a name="api-overview">🌐 API Overview</a>

> **Base URL**: `http://localhost:5062/api`  
> All endpoints (except Auth) require the header: `Authorization: Bearer <token>`

### 🔐 Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new employee |
| `POST` | `/auth/login` | Public | Login with username & password |
| `POST` | `/auth/login-pin` | Public | POS login with 4-digit PIN |
| `GET` | `/auth/me` | JWT | Get current user profile |
| `POST` | `/auth/logout` | JWT | Logout current session |

### 📦 Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/products` | JWT | List products (paginated, searchable) |
| `GET` | `/products/:id` | JWT | Get product details |
| `GET` | `/products/barcode/:code` | JWT | Barcode lookup for POS |
| `POST` | `/products` | Manager | Create a new product |
| `PUT` | `/products/:id` | Manager | Update a product |
| `DELETE` | `/products/:id` | Manager | Delete a product |

### 🛒 Orders & POS

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/orders` | Manager | List all orders |
| `GET` | `/orders/:id` | JWT | Get order details |
| `POST` | `/orders/checkout` | JWT | Process checkout — create a new order |
| `GET` | `/pos/held-orders` | JWT | List currently held (parked) orders |

### ⏰ Shifts

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/shifts` | Manager | List shift history |
| `GET` | `/shifts/current` | JWT | Get the currently open shift |
| `POST` | `/shifts/open` | JWT | Open a new shift |
| `POST` | `/shifts/:id/close` | JWT | Close shift & generate summary |
| `GET` | `/shifts/:id/report` | JWT | Get detailed shift report |

### 👥 Employees

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/employees` | Manager | List all employees |
| `GET` | `/employees/:id` | Manager | Get employee details |
| `POST` | `/employees` | Manager | Create a new employee |
| `PUT` | `/employees/:id` | Manager | Update employee info |
| `PATCH` | `/employees/:id/reset-pin` | Manager | Reset cashier PIN |
| `DELETE` | `/employees/:id` | Manager | Delete an employee |

### 👤 Customers

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/customers` | JWT | List all customers |
| `GET` | `/customers/:id` | JWT | Get customer profile & VIP points |
| `GET` | `/customers/phone/:phone` | JWT | Search by phone number (POS) |
| `POST` | `/customers` | JWT | Register a new customer |
| `PUT` | `/customers/:id` | JWT | Update customer info |

### 🏭 Purchase Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/purchase-orders` | Manager | List all purchase orders |
| `GET` | `/purchase-orders/:id` | Manager | Get purchase order details |
| `POST` | `/purchase-orders` | Manager | Create a purchase order |
| `PATCH` | `/purchase-orders/:id/receive` | Manager | Receive goods — update inventory |
| `PATCH` | `/purchase-orders/:id/cancel` | Manager | Cancel a purchase order |

### 📊 Inventory & Reports

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/inventory` | JWT | Get current stock levels |
| `POST` | `/inventory/adjust` | Manager | Manual inventory adjustment |
| `GET` | `/reports/revenue` | Manager | Revenue report by date range |
| `GET` | `/reports/top-products` | Manager | Top-selling products |
| `GET` | `/reports/profit` | Manager | Gross profit report |

---

## <a name="environment-variables">📌 Environment Variables</a>

### Backend — `appsettings.json`

Create `appsettings.json` from the provided template:

```bash
cp appsettings.example.json appsettings.json
```

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=<host>;Database=<db>;Username=<user>;Password=<password>;SSL Mode=Require;Trust Server Certificate=true;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Jwt": {
    "Key": "<your-secret-key-min-32-chars>",
    "Issuer": "FreshMartApi",
    "Audience": "FreshMartClient",
    "DurationInMinutes": 480
  }
}
```

| Setting | Required | Description |
|---|---|---|
| `ConnectionStrings.DefaultConnection` | ✅ | PostgreSQL connection string |
| `Jwt.Key` | ✅ | Secret key for signing JWT tokens (minimum 32 characters) |
| `Jwt.Issuer` | ✅ | JWT token issuer claim |
| `Jwt.Audience` | ✅ | JWT token audience claim |
| `Jwt.DurationInMinutes` | ✅ | Token expiry duration (default: 480 min = 8 hours) |

### Frontend — `freshmart/.env`

```bash
cd freshmart
cp .env.example .env
```

```env
# Backend API base URL
VITE_API_BASE_URL=http://localhost:5062/api
```

---

## <a name="development-notes">📝 Development Notes</a>

### Backend Architecture

- **Service Layer Pattern**: All business logic lives in `Services/`. Controllers handle only HTTP concerns and delegate to services.
- **EF Core + snake_case**: `EFCore.NamingConventions` automatically converts `PascalCase` model properties to `snake_case` PostgreSQL columns on query and migration.
- **Standard Response Envelope**: Every API response follows `{ success, statusCode, message, data, meta }`. See `docs/api_convention.txt`.
- **Global Exception Handler**: `ExceptionHandlingMiddleware` catches all unhandled exceptions and returns a structured JSON error instead of an HTML error page.
- **JSON Enum Serialization**: `JsonStringEnumConverter` is registered globally — the frontend can send either `"Cashier"` or `0` and both are accepted.

### Frontend Architecture

- **Zustand Stores**: State is managed per domain (`useAuthStore`, `usePOSStore`, etc.).
- **Axios Service Layer**: All API calls go through `services/` with an interceptor that automatically attaches the JWT token.
- **Tailwind CSS v4**: Uses the `@tailwindcss/vite` plugin — no `tailwind.config.js` required.
- **Route Protection**: Protected routes redirect to `/login` if the user is not authenticated.

### API Conventions

- **URL Pattern**: `GET /api/{resource}` — lowercase enforced via `RouteOptions.LowercaseUrls` in `Program.cs`.
- **Pagination**: `?page=1&limit=20` — response includes `meta.totalItems` and `meta.totalPages`.
- **Search**: `?search=<keyword>` — searches by name, barcode, or SKU.
- **Status Filter**: `?status=Active` — filters by enum value.

### Standard Response Format

```json
// Success
{
  "success": true,
  "statusCode": 200,
  "message": "Products retrieved successfully",
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "totalItems": 150, "totalPages": 8 }
}

// Error
{
  "success": false,
  "statusCode": 400,
  "errorCode": "INVALID_STOCK_QUANTITY",
  "message": "Requested quantity exceeds available stock",
  "errors": [{ "field": "quantity", "message": "Requested (10) exceeds stock (5)" }]
}
```

---

<div align="center">
  <p>Built with ❤️ using ASP.NET Core 10 &amp; React 19</p>
  <p>
    <a href="docs/API_DEVELOPMENT_PLAN.md">📋 API Development Plan</a> •
    <a href="docs/api_convention.txt">📐 API Convention</a> •
    <a href="appsettings.example.json">⚙️ Config Example</a>
  </p>
</div>
