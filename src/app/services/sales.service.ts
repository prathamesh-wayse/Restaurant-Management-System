import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DailySales } from '../models/daily-sales.models';
import { MonthlySales } from '../models/monthly-sales.model';
import { YearlySales } from '../models/yearly-sales.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private apiUrl = 'https://localhost:7197/api/Orders';

  constructor(private http: HttpClient) {}

  getDailySales(): Observable<DailySales[]> {
    return this.http.get<DailySales[]>(`${this.apiUrl}/daily-sales`);
  }

  getDailySalesByDate(from: string, to: string): Observable<DailySales[]> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    return this.http.get<DailySales[]>(
      `${this.apiUrl}/daily-sales/filter`,
      { params }
    );
  }

  getMonthlySales(): Observable<MonthlySales[]> {
    return this.http.get<MonthlySales[]>(`${this.apiUrl}/monthly-sales`);
  }

  getYearlySales(): Observable<YearlySales[]> {
    return this.http.get<YearlySales[]>(`${this.apiUrl}/yearly-sales`);
  }
}
