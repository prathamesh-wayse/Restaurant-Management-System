export interface Order {

  orderID?: number;
  customerID: number;
  employeeID: number;
  items: OrderItem[];
  orderDate?: string;
  totalAmount?: number;
}


export interface OrderItem {
  menuItemID: number;
  quantity: number;
  price: number;
}
