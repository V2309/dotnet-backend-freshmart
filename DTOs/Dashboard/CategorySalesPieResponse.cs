namespace dotnet_backend_freshmart.DTOs.Dashboard
{
    public class CategoryPieItem
    {
        public string Name { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal TotalRevenue { get; set; }
        public string Color { get; set; } = "#FE9F43";
    }

    public class CategorySalesPieResponse
    {
        public int TotalCategories { get; set; }
        public int TotalProducts { get; set; }
        public List<CategoryPieItem> TopCategories { get; set; } = [];
        public List<CategoryPieItem> PieData { get; set; } = [];
    }
}
