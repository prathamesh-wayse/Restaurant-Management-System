import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Employee List</h2>

    <input type="text" placeholder="Search..."
      (input)="onSearch($event)">

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Role</th>
          <th>Phone</th>
          <th>Salary</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let e of employees$ | async; let i = index">
          <td>{{ (currentPage - 1) * 10 + i + 1 }}</td>
          <td>{{ e.name }}</td>
          <td>{{ e.role }}</td>
          <td>{{ e.phone }}</td>
          <td>{{ e.salary }}</td>
          <td>
            <button (click)="edit(e)">Edit</button>
            <button (click)="delete(e.employeeID!)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div>
      <button *ngFor="let p of pages"
        (click)="setPage(p)"
        [disabled]="p === currentPage">
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
export class EmployeeListComponent implements OnInit {

  employees$!: Observable<Employee[]>;
  pages: number[] = [];
  currentPage = 1;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employees$ = this.employeeService.employees$;

    this.employeeService.totalCount$.subscribe(total => {
      this.pages = Array.from(
        { length: Math.ceil(total / 10) },
        (_, i) => i + 1
      );
    });
  }

  onSearch(e: Event) {
    this.currentPage = 1;
    this.employeeService.setSearchText(
      (e.target as HTMLInputElement).value
    );
  }

  setPage(p: number) {
    this.currentPage = p;
    this.employeeService.setPage(p);
  }

  delete(id: number) {
    if (confirm('Delete employee?')) {
      this.employeeService.deleteEmployee(id)
        .subscribe(() => this.employeeService.notifyRefresh());
    }
  }

  edit(e: Employee) {
    this.employeeService.selectEmployee(e);
  }
}
