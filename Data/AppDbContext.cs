using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;
namespace dotnet_backend_freshmart.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        public DbSet<Employee> Employees { get; set; } = null!;

        public DbSet<Category> Categories { get; set; } = null!;

        public DbSet<Supplier> Suppliers { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // PostgreSQL enum type cho EmployeeRole
            modelBuilder.HasPostgresEnum<EmployeeRole>();

            // Sequence để sinh mã nhân viên NV000001, NV000002, ...
            // nextval() là atomic → không bao giờ trùng dù nhiều request đồng thời
            modelBuilder.HasSequence<int>("employee_code_seq")
                .StartsAt(1)
                .IncrementsBy(1);

            // Sequence sinh mã nhà cung cấp NCC000001, NCC000002...
            modelBuilder.HasSequence<int>("supplier_code_seq")
                .StartsAt(1)
                .IncrementsBy(1);

            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(AppDbContext).Assembly
            );
        }
   
    }
}
