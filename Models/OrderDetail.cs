using System.Text.Json.Serialization;


namespace RestaurantAPI.Models
 { 
     public class OrderDetail
           {
            public int OrderDetailID { get; set; }
            public int OrderID { get; set; }

            [JsonIgnore]     
            public Order? Order { get; set; }

            public int MenuItemID { get; set; }
            public MenuItem? MenuItem { get; set; }
            public int Quantity { get; set; }

            public decimal Price { get; set; }
           }

    }
