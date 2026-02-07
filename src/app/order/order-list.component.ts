

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { OrderService } from '../services/order.service';
import { CustomerService } from '../services/customer.service';
import { OrderView } from '../models/order-view.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {

  orders$!: Observable<OrderView[]>;

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.orders$ = combineLatest([
      this.orderService.orders$,     // Observable<Order[]>
      this.customerService.customers$ // Observable<Customer[]>
    ]).pipe(
      map(([orders, customers]) =>
        orders.map(order => {
          const customerName =
            customers.find(c => c.customerID === order.customerID)?.name || 'Unknown';

          return {
            ...order,
            customerName
          } as OrderView; //  VERY IMPORTANT
        })
      )
    );
  }
}
