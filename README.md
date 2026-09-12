# FreshMart Backend API

ASP.NET Core 10 + EF Core + JWT + PostgreSQL (Neon)

## Stack
- **Framework**: ASP.NET Core 10 Web API
- **ORM**: Entity Framework Core 10 + Npgsql
- **Database**: PostgreSQL (Neon)
- **Auth**: JWT Bearer + BCrypt PIN
- **Docs**: Scalar (OpenAPI)

## Setup

```bash
# 1. Copy config mẫu
cp appsettings.example.json appsettings.json
# Điền connection string và JWT key vào appsettings.json

# 2. Apply migrations
dotnet ef database update

# 3. Chạy
dotnet run
```

## API Endpoints

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/v1/auth/register` | Public | Đăng ký nhân viên |
| POST | `/api/v1/auth/login` | Public | Đăng nhập |
| POST | `/api/v1/auth/login-pin` | Public | Đăng nhập POS |
| GET | `/api/v1/auth/me` | JWT | Thông tin user hiện tại |
| POST | `/api/v1/auth/logout` | JWT | Đăng xuất |

## Response Format

```json
{ "success": true, "message": "...", "data": { ... } }
{ "success": false, "message": "...", "errors": [] }
```
