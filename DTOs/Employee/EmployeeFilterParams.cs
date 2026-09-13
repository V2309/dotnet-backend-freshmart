using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Employee
{
    public class EmployeeFilterParams
    {
        /// <summary>Tìm kiếm theo Tên, Số điện thoại hoặc Mã nhân viên</summary>
        public string? Search { get; set; }
        /// <summary>Lọc theo Role: Cashier, StoreManager, WarehouseStaff, Admin</summary>
        public EmployeeRole? Role { get; set; }
        /// <summary>Lọc theo trạng thái: true (đang hoạt động), false (đã khóa), null (tất cả)</summary>
        public bool? IsActive { get; set; }
        /// <summary>Trang hiện tại (mặc định 1)</summary>
        public int Page { get; set; } = 1;
        /// <summary>Số lượng mỗi trang (mặc định 20, tối đa 100)</summary>
        public int Limit { get; set; } = 20;
    }
}
