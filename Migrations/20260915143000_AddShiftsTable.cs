using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnet_backend_freshmart.Migrations
{
    /// <inheritdoc />
    public partial class AddShiftsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Tạo bảng shifts có đầy đủ khóa ngoại liên kết với bảng employees
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS shifts (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
                    shift_name VARCHAR(100) NOT NULL,
                    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    end_time TIMESTAMPTZ,
                    starting_cash NUMERIC(15,2) NOT NULL DEFAULT 0,
                    expected_cash NUMERIC(15,2) NOT NULL DEFAULT 0,
                    actual_cash NUMERIC(15,2),
                    total_revenue NUMERIC(15,2) NOT NULL DEFAULT 0,
                    order_count INTEGER NOT NULL DEFAULT 0,
                    status VARCHAR(20) NOT NULL DEFAULT 'Active',
                    notes TEXT,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );

                CREATE INDEX IF NOT EXISTS ix_shifts_employee_id ON shifts(employee_id);
                CREATE INDEX IF NOT EXISTS ix_shifts_status ON shifts(status);
                CREATE INDEX IF NOT EXISTS ix_shifts_start_time ON shifts(start_time);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DROP TABLE IF EXISTS shifts CASCADE;
            ");
        }
    }
}
