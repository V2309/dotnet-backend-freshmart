namespace dotnet_backend_freshmart.DTOs.Category
{
  
        public class CategoryResponse
        {
            public Guid Id { get; set; }
            public string Slug { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
            public string? Icon { get; set; }
            public short SortOrder { get; set; }
            public bool IsActive { get; set; }
            public int ProductCount { get; set; }
            public DateTime CreatedAt { get; set; }
        }
    

}
