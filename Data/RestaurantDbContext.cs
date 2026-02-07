

using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Models;

namespace RestaurantAPI.Data
{
    public class RestaurantDbContext : DbContext
    {
        public RestaurantDbContext(DbContextOptions<RestaurantDbContext> options)
            : base(options) { }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }

        //  ORDER TABLES
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Decimal precision
            modelBuilder.Entity<Employee>()
                .Property(e => e.Salary)
                .HasPrecision(18, 2);

            modelBuilder.Entity<MenuItem>()
                .Property(m => m.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasPrecision(18, 2);

            // SEED DATA (no change needed)
            modelBuilder.Entity<Customer>().HasData(
                new Customer
                {
                    CustomerID = 1,
                    Name = "Manohar Mhatre",
                    Phone = "9878988987",
                    Email = "Mhatre@xyz.com",
                    Address = "123 Road"
                },
                new Customer
                {
                    CustomerID = 2,
                    Name = "Pratiuman Satam",
                    Phone = "9870088987",
                    Email = "ACP@xyz.com",
                    Address = "Cid Road"
                }
            );

            modelBuilder.Entity<Employee>().HasData(
                new Employee
                {
                    EmployeeID = 1,
                    Name = "Ramu kaka",
                    Role = "Waiter",
                    phone = "1272745757",
                    Salary = 15500
                },
                new Employee
                {
                    EmployeeID = 2,
                    Name = "Chotu Bunty",
                    Role = "Cleaner",
                    phone = "1272740007",
                    Salary = 10500
                }
            );

            modelBuilder.Entity<MenuItem>().HasData(
                new MenuItem
                {
                    MenuItemID = 1,
                    Name = "Special Veg Thali",
                    Description = "Veg Special",
                    Price = 120,
                    Category = "VEG"
                },
                new MenuItem
                {
                    MenuItemID = 2,
                    Name = "Chicken Thali",
                    Description = "Spicy Chicken",
                    Price = 200,
                    Category = "NON-VEG"
                },
                new MenuItem
                {
                    MenuItemID = 3,
                    Name = "Coke",
                    Description = "500ml bottle",
                    Price = 40,
                    Category = "Drink"
                },
                new MenuItem
                {
                    MenuItemID = 4,
                    Name = "Pasta Alfredo",
                    Description = "Creamy pasta with cheese",
                    Price = 200,
                    Category = "Main Course"
                }
            );
        }
    }
}
