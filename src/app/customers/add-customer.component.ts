// Angular core imports
import { Component, OnInit, OnDestroy } from '@angular/core';

// Common directives like *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Template-driven forms support (ngModel, ngForm)
import { FormsModule } from '@angular/forms';

// RxJS subscription (to avoid memory leaks)
import { Subscription } from 'rxjs';

// Service & model
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],

  // Inline HTML template
  template: `
    <h2>Add / Edit Customer</h2>

    <!-- Angular template-driven form -->
    <form (ngSubmit)="onSubmit()" #customerForm="ngForm">

      <label>Name:</label><br>
      <input
        type="text"
        name="name"
        [(ngModel)]="customer.name"
        required>
      <br><br>

      <label>Phone:</label><br>
      <input
        type="text"
        name="phone"
        [(ngModel)]="customer.phone"
        required>
      <br><br>

      <label>Email:</label><br>
      <input
        type="email"
        name="email"
        [(ngModel)]="customer.email"
        required>
      <br><br>

      <label>Address:</label><br>
      <input
        type="text"
        name="address"
        [(ngModel)]="customer.address"
        required>
      <br><br>

      <!-- Button text changes automatically -->
      <button type="submit">
        {{ customer.customerID ? 'Update Customer' : 'Add Customer' }}
      </button>

    </form>
  `,


     styles: [`
    /* ===== FORM CONTAINER ===== */
    .customer-form {
      max-width: 400px;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      font-family: Arial, sans-serif;
    }

    h2 {
      margin-bottom: 15px;
      color: #1976d2;
    }

    /* ===== FORM GROUP ===== */
    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
    }

    label {
      font-weight: 600;
      margin-bottom: 4px;
    }

    /* ===== INPUTS ===== */
    input {
      padding: 8px 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }

    input:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 3px rgba(25, 118, 210, 0.4);
    }

    /* ===== BUTTON ===== */
    button {
      margin-top: 10px;
      padding: 10px;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 15px;
      cursor: pointer;
    }

    button:hover {
      background-color: #125ea8;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class addCustomerComponent implements OnInit, OnDestroy {

  // Holds form data (used for both Add & Edit)
  customer: Customer = {
    name: '',
    phone: '',
    email: '',
    address: ''
  };

  // To store subscription reference
  private subscription!: Subscription;

  constructor(private customerService: CustomerService) {}

  // Runs when component is created
  ngOnInit(): void {
    // Listen for selected customer (Edit case)
    this.subscription = this.customerService.selectedCustomer$
      .subscribe((c) => {
        if (c) {
          // Copy object to avoid reference issues
          this.customer = { ...c };
        }
      });
  }

  // Called when form is submitted
  onSubmit(): void {

    // If customerID exists → UPDATE
    if (this.customer.customerID) {
      this.customerService.updateCustomer(this.customer).subscribe({
        next: () => {
          alert('Customer Updated Successfully');
          this.afterSave();
        },
        error: (err) => {
          console.error(err);
          alert('Error Updating Customer');
        }
      });
    }

    // Else → ADD new customer
    else {
      this.customerService.addCustomer(this.customer).subscribe({
        next: () => {
          alert('Customer Added Successfully');
          this.afterSave();
        },
        error: (err) => {
          console.error(err);
          alert('Error Adding Customer');
        }
      });
    }
  }

  // Runs after Add or Update
  afterSave(): void {
    // Notify customer list to reload
    this.customerService.notifyRefresh();

    // Reset form data
    this.customer = {
      name: '',
      phone: '',
      email: '',
      address: ''
    };
  }

  // Cleanup to prevent memory leaks
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
