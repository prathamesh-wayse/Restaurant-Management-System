import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  [x: string]: any;

  // API URL
  private apiUrl = 'https://localhost:7197/api/Customers';

  constructor(private http: HttpClient) {}

  //  refresh trigger (add / delete / update)
  private refresh$ = new BehaviorSubject<void>(undefined);

  //  search text
  private searchText$ = new BehaviorSubject<string>('');

  //  pagination state
  private page$ = new BehaviorSubject<number>(1);
  private pageSize = 10; // customers per page

  //  customers stream (search + pagination + refresh)
  customers$: Observable<Customer[]> = combineLatest([
    this.refresh$,
    this.searchText$,
    this.page$
  ]).pipe(
    switchMap(([_, searchText, page]) =>
      this.http.get<Customer[]>(this.apiUrl).pipe(
        map(customers => {

          //  filter customers
          const filtered = customers.filter(c =>
            c.name.toLowerCase().includes(searchText) ||
            c.email.toLowerCase().includes(searchText) ||
            c.phone.toLowerCase().includes(searchText)
          );

          //  pagination logic
          const start = (page - 1) * this.pageSize;
          return filtered.slice(start, start + this.pageSize);
        })
      )
    )
  );

  //  total count (for page buttons)
  totalCount$: Observable<number> = combineLatest([
    this.refresh$,
    this.searchText$
  ]).pipe(
    switchMap(([_, searchText]) =>
      this.http.get<Customer[]>(this.apiUrl).pipe(
        map(customers =>
          customers.filter(c =>
            c.name.toLowerCase().includes(searchText) ||
            c.email.toLowerCase().includes(searchText) ||
            c.phone.toLowerCase().includes(searchText)
          ).length
        )
      )
    )
  );

  //  trigger reload
  notifyRefresh(): void {
    this.refresh$.next();
  }

  //  update search + reset page
  setSearchText(text: string): void {
    this.searchText$.next(text.toLowerCase());
    this.page$.next(1);
  }

  //  change page
  setPage(page: number): void {
    this.page$.next(page);
  }

  // ---------- API CALLS ----------

  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(customer: Customer): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${customer.customerID}`,
      customer
    );
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ---------- EDIT SUPPORT ----------

  private selectedCustomerSource =
    new BehaviorSubject<Customer | null>(null);

  selectedCustomer$ = this.selectedCustomerSource.asObservable();

  selectCustomer(customer: Customer): void {
    this.selectedCustomerSource.next(customer);
  }
}
