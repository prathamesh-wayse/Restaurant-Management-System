import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Add / Edit Employee</h2>

    <form (ngSubmit)="onSubmit()" class="employee-form">

      <input type="text" placeholder="Name"
        [(ngModel)]="employee.name" name="name" required>

      <input type="text" placeholder="Role"
        [(ngModel)]="employee.role" name="role" required>

      <input type="text" placeholder="Phone"
        [(ngModel)]="employee.phone" name="phone" required>

      <input type="number" placeholder="Salary"
        [(ngModel)]="employee.salary" name="salary" required>

      <button type="submit">
        {{ employee.employeeID ? 'Update Employee' : 'Add Employee' }}
      </button>
    </form>
  `,
  styles: [`
    .employee-form {
      max-width: 400px;
      padding: 20px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,.1);
    }
    input {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
    }
    button {
      width: 100%;
      padding: 10px;
      background: #1976d2;
      color: white;
      border: none;
      cursor: pointer;
    }
  `]
})
export class AddEmployeeComponent implements OnInit, OnDestroy {

  employee: Employee = {
    name: '',
    role: '',
    phone: '',
    salary: 0
  };

  private sub!: Subscription;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.sub = this.employeeService.selectedEmployee$
      .subscribe(e => {
        if (e) this.employee = { ...e };
      });
  }

  onSubmit(): void {
    if (this.employee.employeeID) {
      this.employeeService.updateEmployee(this.employee)
        .subscribe(() => this.afterSave());
    } else {
      this.employeeService.addEmployee(this.employee)
        .subscribe(() => this.afterSave());
    }
  }

  afterSave(): void {
    this.employeeService.notifyRefresh();
    this.employee = { name: '', role: '', phone: '', salary: 0 };
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
