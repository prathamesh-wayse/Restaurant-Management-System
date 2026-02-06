import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddOrderComponent } from './add-order.component';
import { OrderListComponent } from './order-list.component';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    CommonModule,
    AddOrderComponent,
    OrderListComponent
  ],
  template: `
    <h1>Orders</h1>

    <!-- ADD ORDER FORM -->
    <app-add-order></app-add-order>

    <hr />

    <!-- ORDER LIST TABLE -->
    <app-order-list></app-order-list>
  `
})
export class OrderPageComponent {}
