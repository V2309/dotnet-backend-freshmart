using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnet_backend_freshmart.Migrations
{
    /// <inheritdoc />
    public partial class AddOrdersAndOrderItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Sequence sinh mã đơn hàng HD000001, HD000002...
            migrationBuilder.Sql(@"
                CREATE SEQUENCE IF NOT EXISTS order_code_seq START WITH 1 INCREMENT BY 1;
            ");

            // 2. Tạo bảng orders
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS orders (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    code VARCHAR(20) NOT NULL UNIQUE,
                    shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
                    customer_id UUID,
                    customer_name VARCHAR(150) NOT NULL DEFAULT 'Khách lẻ vãng lai',
                    customer_phone VARCHAR(20),
                    cashier_id UUID REFERENCES employees(id) ON DELETE SET NULL,
                    cashier_name VARCHAR(150) NOT NULL,
                    subtotal NUMERIC(15,2) NOT NULL DEFAULT 0,
                    discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
                    discount_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
                    vat_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
                    total NUMERIC(15,2) NOT NULL DEFAULT 0,
                    payment_method VARCHAR(30) NOT NULL DEFAULT 'Cash',
                    amount_received NUMERIC(15,2) NOT NULL DEFAULT 0,
                    change_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
                    status VARCHAR(30) NOT NULL DEFAULT 'Completed',
                    note TEXT,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );

                CREATE UNIQUE INDEX IF NOT EXISTS ix_orders_code ON orders(code);
                CREATE INDEX IF NOT EXISTS ix_orders_shift_id ON orders(shift_id);
                CREATE INDEX IF NOT EXISTS ix_orders_cashier_id ON orders(cashier_id);
                CREATE INDEX IF NOT EXISTS ix_orders_created_at ON orders(created_at);
                CREATE INDEX IF NOT EXISTS ix_orders_status ON orders(status);
            ");

            // 3. Tạo bảng order_items
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS order_items (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
                    product_name VARCHAR(255) NOT NULL,
                    sku VARCHAR(30) NOT NULL,
                    quantity INTEGER NOT NULL CHECK (quantity > 0),
                    unit_price NUMERIC(15,2) NOT NULL,
                    cost_price NUMERIC(15,2) NOT NULL DEFAULT 0,
                    discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
                    line_total NUMERIC(15,2) NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );

                CREATE INDEX IF NOT EXISTS ix_order_items_order_id ON order_items(order_id);
                CREATE INDEX IF NOT EXISTS ix_order_items_product_id ON order_items(product_id);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DROP TABLE IF EXISTS order_items CASCADE;
                DROP TABLE IF EXISTS orders CASCADE;
                DROP SEQUENCE IF EXISTS order_code_seq;
            ");
        }
    }
}
