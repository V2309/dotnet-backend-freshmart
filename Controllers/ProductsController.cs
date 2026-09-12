using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.Models;

namespace dotnet_backend_freshmart.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    // Tiêm DbContext thông qua Constructor Injection
    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // 1. GET: api/products (Lấy danh sách sản phẩm)
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _context.Products.ToListAsync();
        return Ok(products);
    }

    // 2. POST: api/products (Thêm sản phẩm mới vào Neon DB)
    [HttpPost]
    public async Task<IActionResult> Create(Product product)
    {
        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return Ok(product);
    }
}   