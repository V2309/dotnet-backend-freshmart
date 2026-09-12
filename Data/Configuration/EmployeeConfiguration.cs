using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnet_backend_freshmart.Data.Configuration
{
    public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
    {
        public void Configure(EntityTypeBuilder<Employee> builder)
        {
            // Table
            builder.ToTable("employees");

            // Primary Key
            builder.HasKey(e => e.Id);

            // Code
            builder.Property(e => e.Code)
                .IsRequired()
                .HasMaxLength(20);

            builder.HasIndex(e => e.Code)
                .IsUnique();

            // Name
            builder.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(150);

            // Phone
            builder.Property(e => e.Phone)
                .HasMaxLength(20);

            // Email
            builder.Property(e => e.Email)
                .HasMaxLength(150);

            // Role: Lưu dạng String để trực quan, độ dài tối đa 50 ký tự
            builder.Property(e => e.Role)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50)
                .HasDefaultValue(EmployeeRole.Cashier);

            // PinHash
            builder.Property(e => e.PinHash);

            // IsActive
            builder.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            // HiredDate
            builder.Property(e => e.HiredDate);

            // Notes
            builder.Property(e => e.Notes);

            // CreatedAt
            builder.Property(e => e.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            // UpdatedAt
            builder.Property(e => e.UpdatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");
        }
    }
}
