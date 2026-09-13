namespace dotnet_backend_freshmart.DTOs.Supplier
{
    public class SupplierFilterParams
    {
        /// <summary>Tìm kiếm theo Tên NCC, Mã code (NCC000001), Người liên hệ hoặc SĐT</summary>
        public string? Search { get; set; }

        /// <summary>Lọc theo trạng thái: true (đang hợp tác), false (ngừng hợp tác), null (tất cả)</summary>
        public bool? IsActive { get; set; }

        /// <summary>Trang hiện tại (mặc định 1)</summary>
        public int Page { get; set; } = 1;

        /// <summary>Số lượng mỗi trang (mặc định 20, tối đa 100)</summary>
        public int Limit { get; set; } = 20;
    }
}
