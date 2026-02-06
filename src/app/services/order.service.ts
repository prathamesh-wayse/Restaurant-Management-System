import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Order } from '../models/order.model';
import { OrderDetails } from '../models/order-details.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'https://localhost:7197/api/Orders';

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable(); //  INITIALIZED

  constructor(private http: HttpClient) {
    this.loadOrders(); // auto-load
  }

 private loadOrders(): void {
  this.http.get<Order[]>(this.apiUrl).subscribe({
    next: data => this.ordersSubject.next(data),
    error: err => {
      console.error('Failed to load orders', err);
      this.ordersSubject.next([]);
    }
  });
}

  refreshOrders(): void {
    this.loadOrders();
  }

  getOrderById(id: number): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order).pipe(
      tap(() => this.refreshOrders())
    );
  }
}
