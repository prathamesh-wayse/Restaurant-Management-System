export interface OrderDetails {
  orderID: number;
  customerID: number;
  customerName: string;
  employeeID: number;
  employeeName: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
}

export interface OrderItem {
  menuItemID: number;
  name: string;
  quantity: number;
  price: number;
}
