
namespace RestaurantAPI.Dto   // ✅ CORRECT
{
    public class CreateOrderItemDto
    {
        public int MenuItemId { get; set; }
        public int Quantity { get; set; }
    }
}

