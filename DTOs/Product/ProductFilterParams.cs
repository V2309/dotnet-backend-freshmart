using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Product
{
    public class ProductFilterParams
    {
        /// <summary>Tìm kiếm theo Tên sản phẩm, Mã SKU hoặc Mã vạch Barcode</summary>
        public string? Search { get; set; }

        /// <summary>Lọc theo Id danh mục</summary>
        public Guid? CategoryId { get; set; }

        /// <summary>Lọc theo slug danh mục (ví dụ: drinks, noodles)</summary>
        public string? CategorySlug { get; set; }

        /// <summary>Lọc theo Id nhà cung cấp</summary>
        public Guid? SupplierId { get; set; }

        /// <summary>Lọc theo trạng thái tồn kho (InStock, LowStock, OutOfStock)</summary>
        public StockStatus? Status { get; set; }

        /// <summary>Lọc theo trạng thái kinh doanh (true: đang bán, false: ngừng bán)</summary>
        public bool? IsActive { get; set; }

        /// <summary>Sắp xếp: name_asc, name_desc, price_asc, price_desc, stock_asc, stock_desc, newest</summary>
        public string? SortBy { get; set; } = "newest";

        /// <summary>Trang hiện tại (mặc định 1)</summary>
        public int Page { get; set; } = 1;

        /// <summary>Số lượng mỗi trang (mặc định 20, tối đa 100)</summary>
        public int Limit { get; set; } = 20;
    }
}
