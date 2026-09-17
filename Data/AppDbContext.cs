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

        public DbSet<Shift> Shifts { get; set; } = null!;

        public DbSet<Order> Orders { get; set; } = null!;

        public DbSet<OrderItem> OrderItems { get; set; } = null!;

        public DbSet<Customer> Customers { get; set; } = null!;

        public DbSet<PurchaseOrder> PurchaseOrders { get; set; } = null!;

        public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; } = null!;

        public DbSet<InventoryAdjustment> InventoryAdjustments { get; set; } = null!;

        public DbSet<Notification> Notifications { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // PostgreSQL enum types
            modelBuilder.HasPostgresEnum<EmployeeRole>();
            modelBuilder.HasPostgresEnum<ShiftStatus>();
            modelBuilder.HasPostgresEnum<PaymentMethod>();
            modelBuilder.HasPostgresEnum<OrderStatus>();

            // Sequence để sinh mã nhân viên NV000001, NV000002, ...
            // nextval() là atomic → không bao giờ trùng dù nhiều request đồng thời
            modelBuilder.HasSequence<int>("employee_code_seq")
                .StartsAt(1)
                .IncrementsBy(1);

            // Sequence sinh mã nhà cung cấp NCC000001, NCC000002...
            modelBuilder.HasSequence<int>("supplier_code_seq")
                .StartsAt(1)
                .IncrementsBy(1);

            // Sequence sinh mã hóa đơn bán lẻ HD000001, HD000002...
            modelBuilder.HasSequence<int>("order_code_seq")
                .StartsAt(1)
                .IncrementsBy(1);

            // Sequence sinh mã khách hàng KH000001, KH000002...
            modelBuilder.HasSequence<int>("customer_code_seq")
                .StartsAt(1)
                .IncrementsBy(1);

            // Sequence sinh mã đơn nhập hàng NH000001, NH000002...
            modelBuilder.HasSequence<int>("purchase_order_code_seq")
                .StartsAt(1)
                .IncrementsBy(1);

            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(AppDbContext).Assembly
            );
        }
   
    }
}
