using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnet_backend_freshmart.Migrations
{
    /// <inheritdoc />
    public partial class AddInventoryAdjustmentEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Bảng inventory_adjustments
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS inventory_adjustments (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
                    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
                    reason VARCHAR(50) NOT NULL DEFAULT 'StockCount',
                    qty_before INTEGER NOT NULL,
                    qty_change INTEGER NOT NULL,
                    qty_after INTEGER NOT NULL,
                    note TEXT,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );

                CREATE INDEX IF NOT EXISTS ix_inventory_adjustments_product_id ON inventory_adjustments(product_id);
                CREATE INDEX IF NOT EXISTS ix_inventory_adjustments_employee_id ON inventory_adjustments(employee_id);
                CREATE INDEX IF NOT EXISTS ix_inventory_adjustments_created_at ON inventory_adjustments(created_at);
                CREATE INDEX IF NOT EXISTS ix_inventory_adjustments_reason ON inventory_adjustments(reason);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DROP TABLE IF EXISTS inventory_adjustments CASCADE;
            ");
        }
    }
}
