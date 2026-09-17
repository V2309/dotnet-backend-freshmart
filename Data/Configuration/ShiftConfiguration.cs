
using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnet_backend_freshmart.Data.Configuration
{
    public class ShiftConfiguration : IEntityTypeConfiguration<Shift>
    {
        public void Configure(EntityTypeBuilder<Shift> builder)
        {
            // Table
            builder.ToTable("shifts");

            // Primary Key
            builder.HasKey(s => s.Id);

            // Shift Name
            builder.Property(s => s.ShiftName)
                .IsRequired()
                .HasMaxLength(100);

            // Times
            builder.Property(s => s.StartTime)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            builder.Property(s => s.EndTime);

            // Cash & Revenue
            builder.Property(s => s.StartingCash)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(s => s.ExpectedCash)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(s => s.ActualCash)
                .HasPrecision(15, 2);

            builder.Property(s => s.TotalRevenue)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            // Order Count
            builder.Property(s => s.OrderCount)
                .IsRequired()
                .HasDefaultValue(0);

            // Status Enum (Lưu dạng String giống như StockStatus và EmployeeRole)
            builder.Property(s => s.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(20)
                .HasDefaultValue(ShiftStatus.Active);

            // Notes
            builder.Property(s => s.Notes);

            // Timestamps
            builder.Property(s => s.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            builder.Property(s => s.UpdatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            // ==========================================
            // CẤU HÌNH KHÓA NGOẠI (Foreign Key)
            // ==========================================
            // 1 Nhân viên (Employee) có thể có nhiều Ca làm việc (Shift)
            builder.HasOne(s => s.Employee)
                .WithMany()
                .HasForeignKey(s => s.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes hỗ trợ tìm kiếm nhanh
            builder.HasIndex(s => s.EmployeeId);
            builder.HasIndex(s => s.Status);
            builder.HasIndex(s => s.StartTime);
        }
    }
}
