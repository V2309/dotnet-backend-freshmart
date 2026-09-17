using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.DTOs.Customer;
using dotnet_backend_freshmart.Services.CustomerService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_backend_freshmart.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomersController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        /// <summary>
        /// 1. GET /api/v1/customers
        /// Lấy danh sách khách hàng (hỗ trợ tìm kiếm, lọc theo hạng thẻ, phân trang).
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin,StoreManager,Cashier,WarehouseStaff")]
        public async Task<IActionResult> GetAll([FromQuery] CustomerFilterParams filterParams)
        {
            var result = await _customerService.GetAllAsync(filterParams);
            return Ok(ApiResponse<IEnumerable<CustomerResponse>>.Ok(result, "Lấy danh sách khách hàng thành công"));
        }

        /// <summary>
        /// 2. GET /api/v1/customers/search-pos
        /// Tra cứu nhanh khách hàng tại quầy POS bằng SĐT hoặc Tên/Mã KH.
        /// </summary>
        [HttpGet("search-pos")]
        [Authorize(Roles = "Admin,StoreManager,Cashier")]
        public async Task<IActionResult> SearchForPos([FromQuery] string query)
        {
            var result = await _customerService.SearchForPosAsync(query);
            if (result == null)
            {
                return Ok(ApiResponse<CustomerResponse?>.Ok(null, "Không tìm thấy khách hàng khớp với từ khóa"));
            }
            return Ok(ApiResponse<CustomerResponse>.Ok(result, "Tìm thấy khách hàng"));
        }

        /// <summary>
        /// 3. GET /api/v1/customers/{id}
        /// Lấy chi tiết 1 khách hàng theo GUID.
        /// </summary>
        [HttpGet("{id:guid}")]
        [Authorize(Roles = "Admin,StoreManager,Cashier,WarehouseStaff")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _customerService.GetByIdAsync(id);
            return Ok(ApiResponse<CustomerResponse>.Ok(result, "Lấy thông tin khách hàng thành công"));
        }

        /// <summary>
        /// 4. POST /api/v1/customers
        /// Tạo mới khách hàng (Hỗ trợ cả trang Khách hàng & Thêm nhanh tại quầy POS).
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin,StoreManager,Cashier")]
        public async Task<IActionResult> Create([FromBody] CreateCustomerRequest request)
        {
            var result = await _customerService.CreateAsync(request);
            return StatusCode(StatusCodes.Status201Created,
                ApiResponse<CustomerResponse>.Ok(result, "Tạo khách hàng mới thành công"));
        }

        /// <summary>
        /// 5. PUT /api/v1/customers/{id}
        /// Cập nhật thông tin khách hàng.
        /// </summary>
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin,StoreManager")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCustomerRequest request)
        {
            var result = await _customerService.UpdateAsync(id, request);
            return Ok(ApiResponse<CustomerResponse>.Ok(result, "Cập nhật thông tin khách hàng thành công"));
        }

        /// <summary>
        /// 6. PATCH /api/v1/customers/{id}/status
        /// Bật / Tắt trạng thái hoạt động của khách hàng.
        /// </summary>
        [HttpPatch("{id:guid}/status")]
        [Authorize(Roles = "Admin,StoreManager")]
        public async Task<IActionResult> ToggleStatus(Guid id)
        {
            var result = await _customerService.ToggleStatusAsync(id);
            var message = result.IsActive ? "Đã kích hoạt tài khoản khách hàng" : "Đã tạm dừng tài khoản khách hàng";
            return Ok(ApiResponse<CustomerResponse>.Ok(result, message));
        }

        /// <summary>
        /// 7. DELETE /api/v1/customers/{id}
        /// Xóa khách hàng khỏi hệ thống (Chỉ Admin).
        /// </summary>
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _customerService.DeleteAsync(id);
            return Ok(ApiResponse.OkNoData("Xóa khách hàng thành công"));
        }
    }
}
