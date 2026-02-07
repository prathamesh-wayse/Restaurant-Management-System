//using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.Models;

namespace RestaurantAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly RestaurantDbContext context;
        public CustomersController(RestaurantDbContext context)
        {
            this.context = context;
        }

        [HttpGet] public async Task<ActionResult<IEnumerable<Customer>>> Get() => await context.Customers.ToListAsync();
        [HttpGet("{id}")] public async Task<ActionResult<Customer>> Get(int id) => await context.Customers.FindAsync(id) is Customer c ? c : NotFound();
        [HttpPost] 
        public async Task<ActionResult<Customer>> Post(Customer c) 
        { context.Customers.Add(c); 
            await context.SaveChangesAsync(); 
            return CreatedAtAction(nameof(Get), 
                new { id = c.CustomerID 
                }, c); 
        }

        [HttpPut("{id}")] public async Task<IActionResult> Put(int id, Customer c) { if (id != c.CustomerID) return BadRequest(); context.Entry(c).State = EntityState.Modified; await context.SaveChangesAsync(); return NoContent(); }
        [HttpDelete("{id}")] public async Task<IActionResult> Delete(int id) { var c = await context.Customers.FindAsync(id); if (c == null) return NotFound(); context.Customers.Remove(c); await context.SaveChangesAsync(); return NoContent(); }
    }
}
