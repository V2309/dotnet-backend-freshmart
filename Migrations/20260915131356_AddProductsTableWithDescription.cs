using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnet_backend_freshmart.Migrations
{
    /// <inheritdoc />
    public partial class AddProductsTableWithDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Sequence cho mã nhà cung cấp NCC000001, NCC000002...
            migrationBuilder.Sql(@"
                CREATE SEQUENCE IF NOT EXISTS supplier_code_seq START WITH 1 INCREMENT BY 1;
            ");

            // 2. Tạo bảng categories nếu chưa có
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS categories (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    slug VARCHAR(50) NOT NULL UNIQUE,
                    name VARCHAR(100) NOT NULL,
                    icon VARCHAR(50),
                    sort_order SMALLINT NOT NULL DEFAULT 0,
                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                CREATE UNIQUE INDEX IF NOT EXISTS ix_categories_slug ON categories(slug);
            ");

            // 3. Tạo bảng suppliers nếu chưa có
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS suppliers (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    code VARCHAR(20) NOT NULL UNIQUE,
                    name VARCHAR(255) NOT NULL,
                    contact_name VARCHAR(150),
                    phone VARCHAR(20),
                    email VARCHAR(150),
                    address TEXT,
                    tax_code VARCHAR(20),
                    bank_account VARCHAR(50),
                    bank_name VARCHAR(150),
                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                    notes TEXT,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                CREATE UNIQUE INDEX IF NOT EXISTS ix_suppliers_code ON suppliers(code);
            ");

            // 4. Tạo bảng products có đầy đủ khóa ngoại & cột description
            migrationBuilder.Sql(@"
                DROP TABLE IF EXISTS products CASCADE;

                CREATE TABLE products (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    sku VARCHAR(30) NOT NULL UNIQUE,
                    barcode VARCHAR(50) UNIQUE,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
                    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
                    unit VARCHAR(20) NOT NULL DEFAULT 'Cai',
                    cost_price NUMERIC(15,2) NOT NULL DEFAULT 0,
                    sell_price NUMERIC(15,2) NOT NULL DEFAULT 0,
                    vat_rate NUMERIC(5,2) NOT NULL DEFAULT 8.00,
                    stock INTEGER NOT NULL DEFAULT 0,
                    min_stock INTEGER NOT NULL DEFAULT 0,
                    image_url TEXT,
                    status VARCHAR(30) NOT NULL DEFAULT 'InStock',
                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                    expiry_date TIMESTAMPTZ,
                    notes TEXT,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );

                CREATE UNIQUE INDEX IF NOT EXISTS ix_products_sku ON products(sku);
                CREATE UNIQUE INDEX IF NOT EXISTS ix_products_barcode ON products(barcode);
                CREATE INDEX IF NOT EXISTS ix_products_category_id ON products(category_id);
                CREATE INDEX IF NOT EXISTS ix_products_supplier_id ON products(supplier_id);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DROP TABLE IF EXISTS products CASCADE;
                DROP TABLE IF EXISTS suppliers CASCADE;
                DROP TABLE IF EXISTS categories CASCADE;
                DROP SEQUENCE IF EXISTS supplier_code_seq;
            ");
        }
    }
}
