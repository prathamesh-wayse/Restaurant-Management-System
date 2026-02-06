import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addCustomerComponent } from './add-customer.component';
import { CustomerListComponent } from './customer-list.component';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [CommonModule, addCustomerComponent, CustomerListComponent],
  template: `
    <h1>Customers</h1>
    <app-add-customer></app-add-customer>
    <hr>
    <app-customer-list></app-customer-list>
  `
})
export class CustomersPageComponent {}
