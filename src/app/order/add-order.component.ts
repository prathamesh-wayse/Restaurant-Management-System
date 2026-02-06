import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { OrderService } from '../services/order.service';
import { CustomerService } from '../services/customer.service';
import { EmployeeService } from '../services/employee.service';
import { MenuService } from '../services/menu.service';

import { Order } from '../models/order.model';
import { Customer } from '../models/customer.model';
import { Employee } from '../models/employee.model';
import { Menu } from '../models/menu.model';

@Component({
  selector: 'app-add-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Create Order</h2>

    <form class="order-form" (ngSubmit)="createOrder()">

      <label>Customer</label>
      <select [(ngModel)]="order.customerID" name="customerID" required>
        <option value="0">-- Select Customer --</option>
        <option *ngFor="let c of customers$ | async" [value]="c.customerID">
          {{ c.name }}
        </option>
      </select>

      <label>Employee</label>
      <select [(ngModel)]="order.employeeID" name="employeeID" required>
        <option value="0">-- Select Employee --</option>
        <option *ngFor="let e of employees$ | async" [value]="e.employeeID">
          {{ e.name }}
        </option>
      </select>

      <label>Menu Item</label>
      <select [(ngModel)]="selectedMenuId" name="menuItemID" required (change)="onMenuChange()">
        <option value="0">-- Select Menu --</option>
        <option *ngFor="let m of menus$ | async" [value]="m.menuItemID">
          {{ m.name }} - ₹{{ m.price }}
        </option>
      </select>

      <label>Quantity</label>
      <input
        type="number"
        [(ngModel)]="quantity"
        name="quantity"
        min="1"
        required
        (input)="calculateTotal()"
      >

      <p><strong>Total Amount: ₹{{ totalAmount }}</strong></p>

      <button type="submit">Place Order</button>
    </form>
  `,
  styles: [`
    .order-form {
      max-width: 450px;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      font-family: Arial;
    }

    label {
      display: block;
      font-weight: 600;
      margin-top: 10px;
    }

    select, input {
      width: 100%;
      padding: 8px;
      margin-top: 4px;
    }

    button {
      margin-top: 15px;
      padding: 10px;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
    }
  `]
})
export class AddOrderComponent implements OnInit {

  customers$!: Observable<Customer[]>;
  employees$!: Observable<Employee[]>;
  menus$!: Observable<Menu[]>;

  order: Order = {
    customerID: 0,
    employeeID: 0,
    items: [] 
  };

  selectedMenuId = 0;
  quantity = 1;
  selectedMenuPrice = 0;
  totalAmount = 0;

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private employeeService: EmployeeService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.customers$ = this.customerService.customers$;
    this.employees$ = this.employeeService.employees$;
    this.menus$ = this.menuService.menus$;
  }

 onMenuChange(): void {
  this.menus$.subscribe(menus => {
    const menu = menus.find(m => m.menuItemID === this.selectedMenuId);
    if (menu) {
      this.selectedMenuPrice = menu.price;
      this.calculateTotal();
    }
  });
}

  calculateTotal(): void {
    this.totalAmount = this.selectedMenuPrice * this.quantity;
  }

  createOrder(): void {

  if (!this.selectedMenuId || this.quantity <= 0) {
    alert('Please select menu and quantity');
    return;
  }

  //  Build order item
  this.order.items = [
    {
      menuItemID: this.selectedMenuId,
      quantity: this.quantity,
      price: this.selectedMenuPrice
    }
  ];

  this.order.totalAmount = this.totalAmount;

  this.orderService.createOrder(this.order).subscribe({
    next: () => {
      alert('Order Created Successfully');
      this.orderService.refreshOrders();

      // Reset form
      this.order = {
        customerID: 0,
        employeeID: 0,
        items: []   //  RESET CORRECTLY
      };

      this.selectedMenuId = 0;
      this.quantity = 1;
      this.totalAmount = 0;
    },
    error: err => {
      console.error(err);
      alert('Failed to create order');
    }
  });
}

}
