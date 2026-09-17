using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnet_backend_freshmart.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS notifications (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    title VARCHAR(255) NOT NULL,
                    message VARCHAR(1000) NOT NULL,
                    type VARCHAR(50) NOT NULL DEFAULT 'Info',
                    is_read BOOLEAN NOT NULL DEFAULT FALSE,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL
                );

                CREATE INDEX IF NOT EXISTS ix_notifications_is_read ON notifications(is_read);
                CREATE INDEX IF NOT EXISTS ix_notifications_created_at ON notifications(created_at);
                CREATE INDEX IF NOT EXISTS ix_notifications_employee_id ON notifications(employee_id);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DROP TABLE IF EXISTS notifications CASCADE;
            ");
        }
    }
}
