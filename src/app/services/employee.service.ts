import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, combineLatest, from } from "rxjs";
import { map, switchMap } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

@Injectable({
    providedIn: 'root' 
})

export class EmployeeService {
    
    private apiUrl = 'https://localhost:7197/api/Employees'; 

    constructor(private http: HttpClient ){}

    // refresh trigger
    private refresh$ = new BehaviorSubject<void>(undefined);

    // search text
    private searchText$ = new BehaviorSubject<string>('');

    // pagination
    private page$ = new BehaviorSubject<number>(1);
    private pageSize = 10;

    // empolyees stream
    employees$: Observable<Employee[]> = combineLatest ( [
        this.refresh$,
        this.searchText$,
        this.page$
    ]).pipe(
        switchMap(([_, searchText, page]) =>
        this.http.get<Employee[]>(this.apiUrl).pipe(
            map(employees => {

                const filtered = employees.filter(e =>
                    e.name.toLowerCase().includes( searchText ) ||
                    e.role.toLowerCase().includes( searchText ) ||
                    e.phone.toLowerCase().includes( searchText ) 
                )

                const start = (page - 1) * this.pageSize;
                return filtered.slice(start, start + this.pageSize);
            })
        )
      )
    );


    // total count
     totalCount$: Observable<number> = combineLatest([
    this.refresh$,
    this.searchText$
  ]).pipe(
    switchMap(([_, searchText]) =>
      this.http.get<Employee[]>(this.apiUrl).pipe(
        map(employees =>
          employees.filter(e =>
            e.name.toLowerCase().includes(searchText) ||
            e.role.toLowerCase().includes(searchText) ||
            e.phone.toLowerCase().includes(searchText)
          ).length
        )
      )
    )
  );

   // ---------- state helpers ----------
  notifyRefresh() {
    this.refresh$.next();
  }

  setSearchText(text: string) {
    this.searchText$.next(text.toLowerCase());
    this.page$.next(1);
  }

  setPage(page: number) {
    this.page$.next(page);
  }

  // ---------- API ----------
  addEmployee(employee: Employee) {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(employee: Employee) {
    return this.http.put(
      `${this.apiUrl}/${employee.employeeID}`,
      employee
    );
  }

  deleteEmployee(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ---------- edit support ----------
  private selectedEmployeeSource =
    new BehaviorSubject<Employee | null>(null);

  selectedEmployee$ = this.selectedEmployeeSource.asObservable();

  selectEmployee(employee: Employee) {
    this.selectedEmployeeSource.next(employee);
  }
}
