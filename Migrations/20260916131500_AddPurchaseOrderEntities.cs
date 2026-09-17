using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnet_backend_freshmart.Migrations
{
    /// <inheritdoc />
    public partial class AddPurchaseOrderEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Sequence purchase_order_code_seq (NH000001, NH000002...)
            migrationBuilder.Sql(@"
                CREATE SEQUENCE IF NOT EXISTS purchase_order_code_seq START WITH 1 INCREMENT BY 1;
            ");

            // 2. Bảng purchase_orders
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS purchase_orders (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    code VARCHAR(20) NOT NULL UNIQUE,
                    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
                    supplier_name VARCHAR(255) NOT NULL,
                    created_by_id UUID REFERENCES employees(id) ON DELETE SET NULL,
                    created_by_name VARCHAR(150) NOT NULL,
                    expected_date DATE,
                    received_date DATE,
                    total_items INTEGER NOT NULL DEFAULT 0,
                    total_value NUMERIC(15,2) NOT NULL DEFAULT 0,
                    paid_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
                    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
                    notes TEXT,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );

                CREATE UNIQUE INDEX IF NOT EXISTS ix_purchase_orders_code ON purchase_orders(code);
                CREATE INDEX IF NOT EXISTS ix_purchase_orders_supplier_id ON purchase_orders(supplier_id);
                CREATE INDEX IF NOT EXISTS ix_purchase_orders_created_by_id ON purchase_orders(created_by_id);
                CREATE INDEX IF NOT EXISTS ix_purchase_orders_status ON purchase_orders(status);
                CREATE INDEX IF NOT EXISTS ix_purchase_orders_created_at ON purchase_orders(created_at);
            ");

            // 3. Bảng purchase_order_items
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS purchase_order_items (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
                    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
                    product_name VARCHAR(255) NOT NULL,
                    sku VARCHAR(30) NOT NULL,
                    quantity_ordered INTEGER NOT NULL DEFAULT 1 CHECK (quantity_ordered > 0),
                    quantity_received INTEGER NOT NULL DEFAULT 0,
                    unit_cost NUMERIC(15,2) NOT NULL DEFAULT 0,
                    line_total NUMERIC(15,2) NOT NULL DEFAULT 0,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );

                CREATE INDEX IF NOT EXISTS ix_purchase_order_items_po_id ON purchase_order_items(purchase_order_id);
                CREATE INDEX IF NOT EXISTS ix_purchase_order_items_product_id ON purchase_order_items(product_id);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DROP TABLE IF EXISTS purchase_order_items CASCADE;
                DROP TABLE IF EXISTS purchase_orders CASCADE;
                DROP SEQUENCE IF EXISTS purchase_order_code_seq;
            ");
        }
    }
}
