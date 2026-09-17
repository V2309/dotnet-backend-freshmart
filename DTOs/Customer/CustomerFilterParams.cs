using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Customer
{
    public class CustomerFilterParams
    {
        /// <summary>Tìm kiếm theo Tên khách hàng, Mã KH (KH000001) hoặc Số điện thoại</summary>
        public string? Search { get; set; }

        /// <summary>Lọc theo hạng thẻ thành viên: Deal, Silver, Gold, Diamond</summary>
        public LoyaltyTier? Tier { get; set; }

        /// <summary>Lọc theo trạng thái hoạt động: true/false/null</summary>
        public bool? IsActive { get; set; }

        /// <summary>Trang hiện tại (mặc định 1)</summary>
        public int Page { get; set; } = 1;

        /// <summary>Số lượng bản ghi mỗi trang (mặc định 20, tối đa 100)</summary>
        public int Limit { get; set; } = 20;
    }
}
