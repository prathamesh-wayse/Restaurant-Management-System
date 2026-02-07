import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Customer List</h2>

    <!--  Search -->
    <input
      type="text"
      placeholder="Search..."
      (input)="onSearch($event)"
      style="margin-bottom:10px; padding:5px;"
    />

    <!--  Table -->
    <table border="1" cellpadding="10">
      <thead>
        <tr>
          <th>S.NO</th>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let c of customers$ | async; let i = index">
          <td>{{ (currentPage - 1) * 10 + i + 1 }}</td>
          <td>{{ c.customerID }}</td>
          <td>{{ c.name }}</td>
          <td>{{ c.email }}</td>
          <td>{{ c.phone }}</td>
          <td>{{ c.address }}</td>
          <td>
            <button (click)="editCustomer(c)">Edit</button>
            <button (click)="deleteCustomer(c.customerID!)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!--  Pagination Buttons -->
    <div class="pagination">
  <button
    *ngFor="let p of pages"
    (click)="setPage(p)"
    [disabled]="p === currentPage"
    [class.active-page]="p === currentPage">
    {{ p }}
  </button>
</div>

  `,

  styles: [`
    /* ===== TABLE ===== */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-family: Arial, sans-serif;
    }

    th {
      background-color: #1976d2;
      color: white;
      padding: 8px;
      text-align: left;
    }

    td {
      padding: 8px;
      border: 1px solid #ddd;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    tr:hover {
      background-color: #f1f1f1;
    }

    /* ===== SEARCH BOX ===== */
    input[type="text"] {
      padding: 6px 10px;
      width: 250px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    /* ===== BUTTONS ===== */
    button {
      padding: 4px 8px;
      margin-right: 4px;
      border: 1px solid #1976d2;
      background-color: white;
      color: #1976d2;
      cursor: pointer;
      border-radius: 4px;
    }

    button:hover {
      background-color: #1976d2;
      color: white;
    }

    /* ===== PAGINATION ===== */
    .pagination {
      margin-top: 10px;
    }

    .pagination button {
      min-width: 32px;
    }

    .active-page {
      background-color: #1976d2 !important;
      color: white !important;
      font-weight: bold;
      cursor: default;
    }

    button:disabled {
      opacity: 0.8;
      cursor: not-allowed;
    }
  `]
})



export class CustomerListComponent implements OnInit {

  customers$!: Observable<Customer[]>;
  pages: number[] = [];
  currentPage = 1;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customers$ = this.customerService.customers$;

    this.customerService.totalCount$.subscribe(total => {
      const pageCount = Math.ceil(total / 10);
      this.pages = Array.from({ length: pageCount }, (_, i) => i + 1);
    });
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.customerService.setPage(page);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.customerService.setSearchText(value);
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure?')) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        this.customerService.notifyRefresh();
      });
    }
  }

  editCustomer(customer: Customer): void {
    this.customerService.selectCustomer(customer);
  }
}
