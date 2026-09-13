using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.DTOs.Employee;
using dotnet_backend_freshmart.Exceptions;
using dotnet_backend_freshmart.Mappings;
using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Services.EmployeeService;
using Microsoft.EntityFrameworkCore;

namespace dotnet_backend_freshmart.Services.EmployeeService
{
    public class EmployeeService : IEmployeeService
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher _passwordHasher;

        public EmployeeService(AppDbContext context, IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        // 1. LẤY DANH SÁCH NHÂN VIÊN (Tìm kiếm, Lọc & Phân trang)
        public async Task<IEnumerable<EmployeeResponse>> GetAllAsync(EmployeeFilterParams filterParams)
        {
            var query = _context.Employees.AsNoTracking().AsQueryable();

            // Tìm kiếm theo tên, SĐT hoặc Mã code
            if (!string.IsNullOrWhiteSpace(filterParams.Search))
            {
                var keyword = filterParams.Search.Trim().ToLower();
                query = query.Where(e =>
                    e.Name.ToLower().Contains(keyword) ||
                    (e.Phone != null && e.Phone.Contains(keyword)) ||
                    e.Code.ToLower().Contains(keyword));
            }

            // Lọc theo Role
            if (filterParams.Role.HasValue)
            {
                query = query.Where(e => e.Role == filterParams.Role.Value);
            }

            // Lọc theo Trạng thái (Hoạt động / Bị khóa)
            if (filterParams.IsActive.HasValue)
            {
                query = query.Where(e => e.IsActive == filterParams.IsActive.Value);
            }

            // Sắp xếp theo ngày tạo mới nhất
            query = query.OrderByDescending(e => e.CreatedAt);

            // Phân trang
            var page = filterParams.Page < 1 ? 1 : filterParams.Page;
            var limit = filterParams.Limit is < 1 or > 100 ? 20 : filterParams.Limit;

            var employees = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return employees.Select(e => e.ToResponse());
        }

        // 2. LẤY CHI TIẾT 1 NHÂN VIÊN THEO ID
        public async Task<EmployeeResponse> GetByIdAsync(Guid id)
        {
            var employee = await _context.Employees
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);

            if (employee == null)
                throw new NotFoundException($"Không tìm thấy nhân viên với ID '{id}'.");

            return employee.ToResponse();
        }

        // 3. THÊM NHÂN VIÊN MỚI
        public async Task<EmployeeResponse> CreateAsync(CreateEmployeeRequest request)
        {
            var cleanPhone = request.Phone.Trim().Replace(" ", "").Replace(".", "");
            var cleanEmail = request.Email?.Trim().ToLower();

            // Kiểm tra trùng SĐT
            var phoneExists = await _context.Employees.AnyAsync(e => e.Phone == cleanPhone);
            if (phoneExists)
                throw new ConflictException($"Số điện thoại '{cleanPhone}' đã được sử dụng.");

            // Kiểm tra trùng Email
            if (!string.IsNullOrWhiteSpace(cleanEmail))
            {
                var emailExists = await _context.Employees.AnyAsync(e => e.Email == cleanEmail);
                if (emailExists)
                    throw new ConflictException($"Email '{cleanEmail}' đã được sử dụng.");
            }

            // Sinh mã nhân viên NV000001 từ PostgreSQL Sequence
            var code = await GenerateNextEmployeeCodeAsync();

            // Băm PIN khởi tạo
            var pinHash = _passwordHasher.HashPassword(request.Pin);

            var employee = new Employee
            {
                Id = Guid.NewGuid(),
                Code = code,
                Name = request.Name.Trim(),
                Phone = cleanPhone,
                Email = string.IsNullOrWhiteSpace(cleanEmail) ? null : cleanEmail,
                Role = request.Role,
                PinHash = pinHash,
                IsActive = true,
                HiredDate = request.HiredDate ?? DateTime.UtcNow,
                Notes = request.Notes?.Trim(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return employee.ToResponse();
        }

        // 4. CẬP NHẬT THÔNG TIN NHÂN VIÊN
        public async Task<EmployeeResponse> UpdateAsync(Guid id, UpdateEmployeeRequest request)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == id);
            if (employee == null)
                throw new NotFoundException($"Không tìm thấy nhân viên với ID '{id}'.");

            var cleanPhone = request.Phone.Trim().Replace(" ", "").Replace(".", "");
            var cleanEmail = request.Email?.Trim().ToLower();

            // Kiểm tra trùng SĐT với người khác
            var phoneExists = await _context.Employees
                .AnyAsync(e => e.Phone == cleanPhone && e.Id != id);
            if (phoneExists)
                throw new ConflictException($"Số điện thoại '{cleanPhone}' đã được nhân viên khác sử dụng.");

            // Kiểm tra trùng Email với người khác
            if (!string.IsNullOrWhiteSpace(cleanEmail))
            {
                var emailExists = await _context.Employees
                    .AnyAsync(e => e.Email == cleanEmail && e.Id != id);
                if (emailExists)
                    throw new ConflictException($"Email '{cleanEmail}' đã được nhân viên khác sử dụng.");
            }

            employee.Name = request.Name.Trim();
            employee.Phone = cleanPhone;
            employee.Email = string.IsNullOrWhiteSpace(cleanEmail) ? null : cleanEmail;
            employee.Role = request.Role;
            employee.HiredDate = request.HiredDate;
            employee.Notes = request.Notes?.Trim();
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return employee.ToResponse();
        }

        // 5. KHÓA / MỞ KHÓA TÀI KHOẢN (Hỗ trợ cả GUID lẫn Mã Code NVxxxxxx)
       
        public async Task<EmployeeResponse> ToggleStatusAsync(string identifier)
        {
            var trimmed = identifier.Trim();

            // Parse GUID ở bên ngoài biểu thức LINQ để tránh lỗi Expression Tree
            var isGuid = Guid.TryParse(trimmed, out var guidId);
            var upperCode = trimmed.ToUpper();
            // Tìm theo GUID (nếu đúng định dạng) hoặc tìm theo Mã nhân viên (NV000002)
            var employee = await _context.Employees.FirstOrDefaultAsync(e =>
                (isGuid && e.Id == guidId) || e.Code == upperCode);
            if (employee == null)
                throw new NotFoundException($"Không tìm thấy nhân viên với mã/id '{identifier}'.");
            // Đảo ngược trạng thái hoạt động
            employee.IsActive = !employee.IsActive;
            employee.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return employee.ToResponse();
        }

        // 6. CẤP LẠI MÃ PIN CHO NHÂN VIÊN
        public async Task ResetPinAsync(Guid id, ResetPinRequest request)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == id);
            if (employee == null)
                throw new NotFoundException($"Không tìm thấy nhân viên với ID '{id}'.");

            employee.PinHash = _passwordHasher.HashPassword(request.NewPin);
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        // 7. XÓA NHÂN VIÊN (Soft delete hoặc xóa cứng)
        public async Task DeleteAsync(Guid id)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == id);
            if (employee == null)
                throw new NotFoundException($"Không tìm thấy nhân viên với ID '{id}'.");

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
        }

        // HELPER: Sinh mã NV từ PostgreSQL Sequence
        private async Task<string> GenerateNextEmployeeCodeAsync()
        {
            var nextVal = await _context.Database
                .SqlQuery<long>($"""SELECT nextval('employee_code_seq') AS "Value" """)
                .FirstAsync();

            return $"NV{nextVal:D6}";
        }
    }
}
