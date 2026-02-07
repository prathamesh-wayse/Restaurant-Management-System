//using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.Models;

namespace RestaurantAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemsController : ControllerBase
    {
        private readonly RestaurantDbContext context;
        public MenuItemsController(RestaurantDbContext context)
        {
            this.context = context;
        }


        // Get Api/MenuItems
        [HttpGet] public async Task<ActionResult<IEnumerable<MenuItem>>> Get() => await context.MenuItems.ToListAsync();
        [HttpGet("{id}")] public async Task<ActionResult<MenuItem>> Get(int id) => await context.MenuItems.FindAsync(id) is MenuItem m ? m : NotFound();
        [HttpPost] public async Task<ActionResult<MenuItem>> Post(MenuItem m) { context.MenuItems.Add(m); await context.SaveChangesAsync(); return CreatedAtAction(nameof(Get), new { id = m.MenuItemID }, m); }

        [HttpPut("{id}")] public async Task<IActionResult> Put(int id, MenuItem m) { if (id != m.MenuItemID) return BadRequest(); context.Entry(m).State = EntityState.Modified; await context.SaveChangesAsync(); return NoContent(); }
        [HttpDelete("{id}")] public async Task<IActionResult> Delete(int id) { var m = await context.MenuItems.FindAsync(id); if (m == null) return NotFound(); context.MenuItems.Remove(m); await context.SaveChangesAsync(); return NoContent(); }


    }
}
