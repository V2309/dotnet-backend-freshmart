using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnet_backend_freshmart.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomerEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Enum loyalty_tier (Deal, Silver, Gold, Diamond)
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'loyalty_tier') THEN
                        CREATE TYPE loyalty_tier AS ENUM ('Deal', 'Silver', 'Gold', 'Diamond');
                    END IF;
                END$$;
            ");

            // 2. Sequence customer_code_seq (KH000001, KH000002...)
            migrationBuilder.Sql(@"
                CREATE SEQUENCE IF NOT EXISTS customer_code_seq START WITH 1 INCREMENT BY 1;
            ");

            // 3. Tạo bảng customers
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS customers (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    code VARCHAR(20) NOT NULL UNIQUE,
                    name VARCHAR(150) NOT NULL,
                    phone VARCHAR(20) UNIQUE,
                    email VARCHAR(150),
                    address TEXT,
                    birth_date DATE,
                    gender VARCHAR(10),
                    points INTEGER NOT NULL DEFAULT 0,
                    total_spent NUMERIC(15,2) NOT NULL DEFAULT 0,
                    tier loyalty_tier NOT NULL DEFAULT 'Deal',
                    last_visit DATE,
                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                    notes TEXT,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );

                CREATE UNIQUE INDEX IF NOT EXISTS ix_customers_code ON customers(code);
                CREATE UNIQUE INDEX IF NOT EXISTS ix_customers_phone ON customers(phone);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DROP TABLE IF EXISTS customers CASCADE;
                DROP SEQUENCE IF EXISTS customer_code_seq;
                DROP TYPE IF EXISTS loyalty_tier;
            ");
        }
    }
}
