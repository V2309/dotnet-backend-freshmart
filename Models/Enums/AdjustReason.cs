namespace dotnet_backend_freshmart.Models.Enums
{
    public enum AdjustReason
    {
        StockCount = 0, // Kiểm kê định kỳ
        Damage = 1,     // Hàng hỏng / lỗi
        Expiry = 2,     // Hết hạn sử dụng
        Return = 3,     // Trả hàng NCC / Khách hoàn
        Other = 4       // Lý do khác
    }
}
