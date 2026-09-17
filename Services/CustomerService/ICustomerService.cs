using dotnet_backend_freshmart.DTOs.Customer;

namespace dotnet_backend_freshmart.Services.CustomerService
{
    public interface ICustomerService
    {
        /// <summary>Lấy danh sách khách hàng có lọc, tìm kiếm và phân trang</summary>
        Task<IEnumerable<CustomerResponse>> GetAllAsync(CustomerFilterParams filterParams);

        /// <summary>Chi tiết 1 khách hàng theo ID</summary>
        Task<CustomerResponse> GetByIdAsync(Guid id);

        /// <summary>Tìm kiếm nhanh khách hàng tại quầy POS theo SĐT hoặc Tên/Mã</summary>
        Task<CustomerResponse?> SearchForPosAsync(string query);

        /// <summary>Thêm mới khách hàng (tự động sinh mã KH000001, tặng điểm chào mừng)</summary>
        Task<CustomerResponse> CreateAsync(CreateCustomerRequest request);

        /// <summary>Cập nhật thông tin khách hàng</summary>
        Task<CustomerResponse> UpdateAsync(Guid id, UpdateCustomerRequest request);

        /// <summary>Bật/Tắt trạng thái hoạt động của khách hàng</summary>
        Task<CustomerResponse> ToggleStatusAsync(Guid id);

        /// <summary>Xóa khách hàng</summary>
        Task DeleteAsync(Guid id);
    }
}
