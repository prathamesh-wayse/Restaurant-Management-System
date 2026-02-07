

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RestaurantAPI.Models
{
    public class OrderItem
    {
        [Key]
        [Column("OrderItemID")]
        public int OrderItemID { get; set; }

        //  Foreign Key -> Order
        [Column("OrderID")]
        public int OrderID { get; set; }

        [ForeignKey(nameof(OrderID))]
        public Order? Order { get; set; }

        //  Foreign Key -> MenuItem
        [Column("MenuItemID")]
        public int MenuItemID { get; set; }

        [ForeignKey(nameof(MenuItemID))]
        public MenuItem? MenuItem { get; set; }

        public int Quantity { get; set; }
    }
}


