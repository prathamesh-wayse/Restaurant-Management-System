using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.Models;

namespace RestaurantAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController(RestaurantDbContext context) : ControllerBase
    {

        // GET: api/Employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> Get() =>
            await context.Employees.ToListAsync();

        // GET: api/Employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> Get(int id) =>
            await context.Employees.FindAsync(id) is Employee e ? e : NotFound();

        // POST: api/Employees
        [HttpPost]
        public async Task<ActionResult<Employee>> Post(Employee e)
        {
            context.Employees.Add(e);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = e.EmployeeID }, e);
        }

        // PUT: api/Employees/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Employee e)
        {
            if (id != e.EmployeeID) return BadRequest();
            context.Entry(e).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Employees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var e = await context.Employees.FindAsync(id);
            if (e == null) return NotFound();
            context.Employees.Remove(e);
            await context.SaveChangesAsync();
            return NoContent();
        }
    }
}

