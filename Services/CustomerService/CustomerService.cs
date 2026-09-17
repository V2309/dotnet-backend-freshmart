using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.DTOs.Customer;
using dotnet_backend_freshmart.Exceptions;
using dotnet_backend_freshmart.Mappings;
using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace dotnet_backend_freshmart.Services.CustomerService
{
    public class CustomerService : ICustomerService
    {
        private readonly AppDbContext _context;

        public CustomerService(AppDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // 1. GET ALL CUSTOMERS
        //    - Search: name, code, phone
        //    - Filter: tier, active status
        //    - Sort: newest first
        //    - Pagination
        // =========================================================
        public async Task<IEnumerable<CustomerResponse>> GetAllAsync(
            CustomerFilterParams filterParams)
        {
            var query = _context.Customers
                .AsNoTracking()
                .AsQueryable();

            // -------------------------
            // Search
            // -------------------------
            if (!string.IsNullOrWhiteSpace(filterParams.Search))
            {
                var keyword = filterParams.Search.Trim();

                query = query.Where(c =>
                    EF.Functions.ILike(c.Name, $"%{keyword}%") ||
                    EF.Functions.ILike(c.Code, $"%{keyword}%") ||
                    (c.Phone != null &&
                     EF.Functions.ILike(c.Phone, $"%{keyword}%")));
            }

            // -------------------------
            // Filter by loyalty tier
            // -------------------------
            if (filterParams.Tier.HasValue)
            {
                query = query.Where(c =>
                    c.Tier == filterParams.Tier.Value);
            }

            // -------------------------
            // Filter by active status
            // -------------------------
            if (filterParams.IsActive.HasValue)
            {
                query = query.Where(c =>
                    c.IsActive == filterParams.IsActive.Value);
            }

            // -------------------------
            // Sort
            // -------------------------
            query = query.OrderByDescending(c => c.CreatedAt);

            // -------------------------
            // Pagination
            // -------------------------
            var page = filterParams.Page < 1
                ? 1
                : filterParams.Page;

            var limit = filterParams.Limit is < 1 or > 100
                ? 20
                : filterParams.Limit;

            var customers = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return customers.Select(c => c.ToResponse());
        }

        // =========================================================
        // 2. GET CUSTOMER BY ID
        // =========================================================
        public async Task<CustomerResponse> GetByIdAsync(Guid id)
        {
            var customer = await _context.Customers
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                throw new NotFoundException(
                    $"Không tìm thấy khách hàng với ID: {id}");
            }

            return customer.ToResponse();
        }

        // =========================================================
        // 3. SEARCH CUSTOMER FOR POS
        //    - Search by exact phone
        //    - Search by exact code
        //    - Search by name
        //    - Only active customers
        // =========================================================
        public async Task<CustomerResponse?> SearchForPosAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return null;
            }

            var keyword = query.Trim();

            var customer = await _context.Customers
                .AsNoTracking()
                .Where(c =>
                    c.IsActive &&
                    (
                        (c.Phone != null && c.Phone == keyword) ||
                        c.Code == keyword ||
                        EF.Functions.ILike(c.Name, $"%{keyword}%")
                    ))
                // Ưu tiên:
                // 1. Exact phone
                // 2. Exact customer code
                // 3. Name
                .OrderByDescending(c =>
                    c.Phone != null && c.Phone == keyword)
                .ThenByDescending(c =>
                    c.Code == keyword)
                .FirstOrDefaultAsync();

            return customer?.ToResponse();
        }

        // =========================================================
        // 4. CREATE CUSTOMER
        //    - Generate KH000001...
        //    - Calculate initial tier
        //    - Give initial points
        // =========================================================
        public async Task<CustomerResponse> CreateAsync(
            CreateCustomerRequest request)
        {
            var now = DateTime.UtcNow;

            var phone = NormalizePhone(request.Phone);
            var email = NormalizeEmail(request.Email);

            // -------------------------
            // Check duplicate phone
            // -------------------------
            if (phone != null)
            {
                var phoneExists = await _context.Customers
                    .AnyAsync(c => c.Phone == phone);

                if (phoneExists)
                {
                    throw new ConflictException(
                        $"Số điện thoại '{request.Phone}' đã được đăng ký cho khách hàng khác.");
                }
            }

            // -------------------------
            // Generate customer code
            // -------------------------
            var code = await GenerateNextCustomerCodeAsync();

            // -------------------------
            // Initial points
            // -------------------------
            var initialPoints = Math.Max(
                request.InitialPoints,
                0);

            var customer = new Customer
            {
                Id = Guid.NewGuid(),

                Code = code,

                Name = request.Name.Trim(),

                Phone = phone,

                Email = email,

                Address = NormalizeString(request.Address),

                BirthDate = request.BirthDate,

                Gender = NormalizeString(request.Gender),

                Points = initialPoints,

                TotalSpent = 0,

                Tier = CalculateTier(initialPoints),

                LastVisit = DateOnly.FromDateTime(now),

                IsActive = true,

                Notes = NormalizeString(request.Notes),

                CreatedAt = now,

                UpdatedAt = now
            };

            _context.Customers.Add(customer);

            await _context.SaveChangesAsync();

            return customer.ToResponse();
        }

        // =========================================================
        // 5. UPDATE CUSTOMER
        // =========================================================
        public async Task<CustomerResponse> UpdateAsync(
            Guid id,
            UpdateCustomerRequest request)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                throw new NotFoundException(
                    $"Không tìm thấy khách hàng với ID: {id}");
            }

            var phone = NormalizePhone(request.Phone);
            var email = NormalizeEmail(request.Email);

            // -------------------------
            // Check duplicate phone
            // -------------------------
            if (phone != null)
            {
                var phoneExists = await _context.Customers
                    .AnyAsync(c =>
                        c.Phone == phone &&
                        c.Id != id);

                if (phoneExists)
                {
                    throw new ConflictException(
                        $"Số điện thoại '{request.Phone}' đã được khách hàng khác sử dụng.");
                }
            }

            // -------------------------
            // Update fields
            // -------------------------
            customer.Name = request.Name.Trim();

            customer.Phone = phone;

            customer.Email = email;

            customer.Address = NormalizeString(request.Address);

            customer.BirthDate = request.BirthDate;

            customer.Gender = NormalizeString(request.Gender);

            customer.Tier = request.Tier;

            customer.IsActive = request.IsActive;

            customer.Notes = NormalizeString(request.Notes);

            customer.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return customer.ToResponse();
        }

        // =========================================================
        // 6. TOGGLE CUSTOMER STATUS
        // =========================================================
        public async Task<CustomerResponse> ToggleStatusAsync(Guid id)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                throw new NotFoundException(
                    $"Không tìm thấy khách hàng với ID: {id}");
            }

            customer.IsActive = !customer.IsActive;
            customer.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return customer.ToResponse();
        }

        // =========================================================
        // 7. DELETE CUSTOMER
        // =========================================================
        public async Task DeleteAsync(Guid id)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                throw new NotFoundException(
                    $"Không tìm thấy khách hàng với ID: {id}");
            }

            _context.Customers.Remove(customer);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // HELPER: CALCULATE LOYALTY TIER
        //
        // >= 5000  -> Diamond
        // >= 1000  -> Gold
        // >= 500   -> Silver
        // < 500    -> Deal
        // =========================================================
        public static LoyaltyTier CalculateTier(int points)
        {
            return points switch
            {
                >= 5000 => LoyaltyTier.Diamond,
                >= 1000 => LoyaltyTier.Gold,
                >= 500 => LoyaltyTier.Silver,
                _ => LoyaltyTier.Deal
            };
        }

        // =========================================================
        // HELPER: GENERATE CUSTOMER CODE
        //
        // PostgreSQL:
        // customer_code_seq
        //
        // Result:
        // KH000001
        // KH000002
        // KH000003
        // =========================================================
        private async Task<string> GenerateNextCustomerCodeAsync()
        {
            var nextVal = await _context.Database
                .SqlQuery<long>(
                    $"""SELECT nextval('customer_code_seq') AS "Value" """)
                .FirstAsync();

            return $"KH{nextVal:D6}";
        }

        // =========================================================
        // HELPER: NORMALIZE PHONE
        // =========================================================
        private static string? NormalizePhone(string? phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
            {
                return null;
            }

            return phone
                .Trim()
                .Replace(" ", "")
                .Replace(".", "")
                .Replace("-", "");
        }

        // =========================================================
        // HELPER: NORMALIZE EMAIL
        // =========================================================
        private static string? NormalizeEmail(string? email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return null;
            }

            return email
                .Trim()
                .ToLowerInvariant();
        }

        // =========================================================
        // HELPER: NORMALIZE OPTIONAL STRING
        // =========================================================
        private static string? NormalizeString(string? value)
        {
            return string.IsNullOrWhiteSpace(value)
                ? null
                : value.Trim();
        }
    }
}