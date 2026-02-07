namespace RestaurantAPI.Models
{
    public class Employee
    {
        public int EmployeeID { get; set; }
        public  required string Name { get; set; }
        public string? Role { get; set; }
        public string? phone { get; set; }
        public decimal Salary { get; set; }
    }
}
