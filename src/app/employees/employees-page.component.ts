import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEmployeeComponent } from './add-employee.component';
import { EmployeeListComponent } from './employee-list.component';

@Component({
  selector: 'app-employees-page',
  standalone: true,
  imports: [CommonModule, AddEmployeeComponent, EmployeeListComponent],
  template: `
    <h1>Employees</h1>
    <app-add-employee></app-add-employee>
    <hr>
    <app-employee-list></app-employee-list>
  `
})
export class EmployeesPageComponent {}
