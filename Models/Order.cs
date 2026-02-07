
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RestaurantAPI.Models
{
    public class Order
    {
        [Key]
        [Column("OrderID")]
        public int OrderID { get; set; }

        [Column("CustomerID")]
        public int CustomerID { get; set; }

        [Column("EmployeeID")]
        public int EmployeeID { get; set; }

        [Column("OrderDate")]
        public DateTime OrderDate { get; set; } = DateTime.Now;

        [Column("TotalAmount")]
        public decimal TotalAmount { get; set; }

        // Navigation property
        public Customer? Customer { get; set; }   
        public Employee? Employee { get; set; }   
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}

