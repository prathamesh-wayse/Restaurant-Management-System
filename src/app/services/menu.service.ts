import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { Menu } from "../models/menu.model";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  // API URL
  private apiUrl = 'https://localhost:7197/api/MenuItems';

  constructor(private http: HttpClient) {}

  //  refresh trigger
  private refreshSource = new BehaviorSubject<void>(undefined);
  refreshRequired$ = this.refreshSource.asObservable();

  //  search text
  private searchText$ = new BehaviorSubject<string>('');

  //  pagination
  private page$ = new BehaviorSubject<number>(1);
  private pageSize = 10;

  //  menu stream (search + pagination + refresh)
  menus$: Observable<Menu[]> = combineLatest([
    this.refreshSource,
    this.searchText$,
    this.page$
  ]).pipe(
    switchMap(([_, searchText, page]) =>
      this.http.get<Menu[]>(this.apiUrl).pipe(
        map(menus => {

          // filter
          const filtered = menus.filter(m =>
            m.name.toLowerCase().includes(searchText) ||
            m.category.toLowerCase().includes(searchText) ||
            m.description.toLowerCase().includes(searchText)
          );

          // pagination
          const start = (page - 1) * this.pageSize;
          return filtered.slice(start, start + this.pageSize);
        })
      )
    )
  );

  //  total count (for pagination buttons)
  totalCount$: Observable<number> = combineLatest([
    this.refreshSource,
    this.searchText$
  ]).pipe(
    switchMap(([_, searchText]) =>
      this.http.get<Menu[]>(this.apiUrl).pipe(
        map(menus =>
          menus.filter(m =>
            m.name.toLowerCase().includes(searchText) ||
            m.category.toLowerCase().includes(searchText) ||
            m.description.toLowerCase().includes(searchText)
          ).length
        )
      )
    )
  );

  // ---------- helpers ----------
  notifyRefresh(): void {
    this.refreshSource.next();
  }

  setSearchText(text: string): void {
    this.searchText$.next(text.toLowerCase());
    this.page$.next(1);
  }

  setPage(page: number): void {
    this.page$.next(page);
  }

  // ---------- API ----------
  addMenu(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(this.apiUrl, menu);
  }

  updateMenu(menu: Menu): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${menu.menuItemID}`,
      menu
    );
  }

  deleteMenu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ---------- edit support ----------
  private selectedMenuSource =
    new BehaviorSubject<Menu | null>(null);

  selectedMenu$ = this.selectedMenuSource.asObservable();

  selectMenu(menu: Menu): void {
    this.selectedMenuSource.next(menu);
  }
}
