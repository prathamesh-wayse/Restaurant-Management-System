import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { OrderService } from '../services/order.service';
import { OrderDetails } from '../models/order-details.model';

@Component({
  selector: 'app-order-details-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <ng-container *ngIf="order$ | async as order; else loading">

      <div class="order-details">
        <h2>Order #{{ order.orderID }}</h2>

        <p><strong>Customer:</strong> {{ order.customerName }}</p>
        <p><strong>Employee:</strong> {{ order.employeeName }}</p>

        <table>
          <thead>
            <tr>
              <th>Menu Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Sub Total</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let item of order.items">
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>₹{{ item.price }}</td>
              <td>₹{{ item.price * item.quantity }}</td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <th colspan="3">Total</th>
              <th>₹{{ order.totalAmount }}</th>
            </tr>
          </tfoot>
        </table>

        <br />
        <button routerLink="/orders">⬅ Back to Orders</button>
      </div>

    </ng-container>

    <ng-template #loading>
      <p>Loading order details...</p>
    </ng-template>
  `,
  styles: [`
    .order-details {
      max-width: 900px;
      margin: auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
    }

    th {
      background: #2f2f2f;
      color: white;
    }
  `]
})
export class OrderDetailsListComponent {

  order$!: Observable<OrderDetails>;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {
    this.order$ = this.route.paramMap.pipe(
      switchMap(params =>
        this.orderService.getOrderById(Number(params.get('id')))
      )
    );
  }
}
