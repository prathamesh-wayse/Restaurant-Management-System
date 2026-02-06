import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { SalesService } from '../services/sales.service';
import { DailySales } from '../models/daily-sales.models';
import { MonthlySales } from '../models/monthly-sales.model';
import { YearlySales } from '../models/yearly-sales.model';

@Component({
  selector: 'app-sales-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sales-container">

      <h2> Sales Dashboard</h2>

      <!-- DATE FILTER -->
      <div class="filter-card">
        <h3> Daily Sales Filter</h3>

        <div class="filter-row">
          <div>
            <label>From</label>
            <input type="date" [(ngModel)]="fromDate">
          </div>

          <div>
            <label>To</label>
            <input type="date" [(ngModel)]="toDate">
          </div>

          <button (click)="applyFilter()">Apply</button>
        </div>
      </div>

      <!-- DAILY SALES -->
      <div class="card">
        <h3>Daily Sales</h3>
        <table>
          <tr>
            <th>Date</th>
            <th>Total</th>
          </tr>
          <tr *ngFor="let d of dailySales$ | async">
            <td>{{ d.saleDate | date }}</td>
            <td>₹{{ d.totalSales }}</td>
          </tr>
        </table>
      </div>

      <!-- MONTHLY SALES -->
      <div class="card">
        <h3>Monthly Sales</h3>
        <table>
          <tr>
            <th>Month</th>
            <th>Total</th>
          </tr>
          <tr *ngFor="let m of monthlySales$ | async">
            <td>{{ m.month }}/{{ m.year }}</td>
            <td>₹{{ m.totalSales }}</td>
          </tr>
        </table>
      </div>

      <!-- YEARLY SALES -->
      <div class="card">
        <h3>Yearly Sales</h3>
        <table>
          <tr>
            <th>Year</th>
            <th>Total</th>
          </tr>
          <tr *ngFor="let y of yearlySales$ | async">
            <td>{{ y.year }}</td>
            <td>₹{{ y.totalSales }}</td>
          </tr>
        </table>
      </div>

    </div>
  `,
  styles: [`
    .sales-container {
      max-width: 1000px;
      margin: auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    h2 {
      margin-bottom: 20px;
      color: #1976d2;
    }

    .card, .filter-card {
      background: #fff;
      padding: 16px;
      margin-bottom: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    th {
      background: #2f2f2f;
      color: #fff;
      padding: 8px;
      text-align: left;
    }

    td {
      border: 1px solid #ddd;
      padding: 8px;
    }

    .filter-row {
      display: flex;
      gap: 15px;
      align-items: end;
      margin-top: 10px;
    }

    label {
      font-weight: 600;
      display: block;
      margin-bottom: 4px;
    }

    input {
      padding: 6px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    button {
      padding: 8px 14px;
      background: #1976d2;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background: #125ea8;
    }
  `]
})
export class SalesPageComponent implements OnInit {

  dailySales$!: Observable<DailySales[]>;
  monthlySales$!: Observable<MonthlySales[]>;
  yearlySales$!: Observable<YearlySales[]>;

  fromDate = '';
  toDate = '';

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loadAllSales();
  }

  loadAllSales(): void {
    this.dailySales$ = this.salesService.getDailySales();
    this.monthlySales$ = this.salesService.getMonthlySales();
    this.yearlySales$ = this.salesService.getYearlySales();
  }

  applyFilter(): void {
    if (!this.fromDate || !this.toDate) {
      alert('Please select both dates');
      return;
    }

    this.dailySales$ =
      this.salesService.getDailySalesByDate(this.fromDate, this.toDate);
  }
}
