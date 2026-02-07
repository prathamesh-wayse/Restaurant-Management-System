


namespace RestaurantAPI.Dto
{
    public class CreateOrderDto
    {
        public int CustomerId { get; set; }
        public int EmployeeId { get; set; }


        public List<CreateOrderItemDto> Items { get; set; } = new();
    }
}





