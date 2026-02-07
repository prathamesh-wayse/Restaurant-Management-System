using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.Dto;
using RestaurantAPI.Models;
using System.Linq;


namespace RestaurantAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly RestaurantDbContext _context;

        public OrdersController(RestaurantDbContext context)
        {
            _context = context;
        }



        // Get Order
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .ToListAsync();

            return Ok(orders);
        }





        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetails(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Customer)   // include customer info
                .Include(o => o.Employee)   // include employee info
                .FirstOrDefaultAsync(o => o.OrderID == id);

            if (order == null)
                return NotFound();

            var orderDetailsDto = new
            {
                order.OrderID,
                CustomerID = order.Customer!.CustomerID,
                CustomerName = order.Customer!.Name,
                EmployeeID = order.Employee!.EmployeeID,
                EmployeeName = order.Employee!.Name,
                Items = order.OrderItems.Select(oi => new
                {
                    oi.MenuItemID,
                    oi.MenuItem!.Name,
                    oi.Quantity,
                    oi.MenuItem.Price
                }).ToList(),
                order.TotalAmount,
                order.OrderDate
            };

            return Ok(orderDetailsDto);
        }








        // POST: api/Orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
        {
            if (dto.Items == null || !dto.Items.Any())
                return BadRequest("Order must contain at least one item");

            var order = new Order
            {
                CustomerID = dto.CustomerId,
                EmployeeID = dto.EmployeeId,
                OrderDate = DateTime.Now
            };

            foreach (var item in dto.Items)
            {
                var menuItem = await _context.MenuItems
                    .FirstOrDefaultAsync(m => m.MenuItemID == item.MenuItemId);

                if (menuItem == null)
                    return BadRequest($"Menu item {item.MenuItemId} not found");

                order.OrderItems.Add(new OrderItem
                {
                    MenuItemID = item.MenuItemId,
                    Quantity = item.Quantity
                });

                order.TotalAmount += menuItem.Price * item.Quantity;
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                OrderID = order.OrderID,
                order.TotalAmount
            });
        }



        // DAY-Wise Total Sales


        [HttpGet("daily-sales")]
        public async Task<IActionResult> GetDailySales()
        {
            var dailySales = await _context.Orders
                .GroupBy(o => o.OrderDate.Date)
                .Select(g => new DailySalesDto
                {
                    SaleDate = g.Key,
                    TotalSales = g.Sum(o => o.TotalAmount)
                })
                .OrderBy(x => x.SaleDate)
                .ToListAsync();   

            return Ok(dailySales);
        }

        // Date wise Sales with Date Filter
        [HttpGet("daily-sales/filter")]
        public async Task<IActionResult> GetDailySalesByDate(
            DateTime fromDate,
            DateTime toDate)
        {
            var dailySales = await _context.Orders
                .Where(o => o.OrderDate >= fromDate.Date &&
                o.OrderDate.Date <= toDate.Date)
                .GroupBy(o => o.OrderDate.Date)
                .Select(g => new DailySalesDto
                {
                    SaleDate = g.Key,
                    TotalSales = g.Sum(o => o.TotalAmount)
                })
            .OrderBy(x => x.SaleDate)
            .ToListAsync();

            return Ok(dailySales);
        }




        // Monthly 

        [HttpGet("monthly-sales")]
        public  async Task<IActionResult> GetMonthlySales()
        {
            var monthlySales = await _context.Orders
                .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                .Select(g => new MonthlySalesDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalSales = g.Sum(o => o.TotalAmount)
                })
                .OrderBy (x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync ();

            return Ok(monthlySales);
        }




        //  Yearly Sales
        [HttpGet("yearly-sales")]
        public async Task<IActionResult> GetYearlySales()
        {
            var yearlysales = await _context.Orders
                .GroupBy(o => o.OrderDate.Year)
                .Select(g => new YearlySalesDto
                {
                    Year = g.Key,
                    TotalSales = g.Sum(o => o.TotalAmount)
                })
                .OrderBy(x => x.Year)
                .ToListAsync();
            return Ok(yearlysales);
        }
    }
}

