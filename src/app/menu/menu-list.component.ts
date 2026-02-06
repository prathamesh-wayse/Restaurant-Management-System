import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuService } from "../services/menu.service";
import { Menu } from "../models/menu.model";
import { Observable } from "rxjs";

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule],

  template: `
   <h2>Menu List</h2>

<table class="menu-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Description</th>
      <th>Category</th>
      <th>Price</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    <tr *ngFor="let m of menus$ | async">
      <td>{{ m.menuItemID }}</td>
      <td>{{ m.name }}</td>
      <td>{{ m.description }}</td>
      <td>{{ m.category }}</td>
      <td>₹{{ m.price }}</td>
      <td>
        <button class="edit-btn" (click)="editMenu(m)">Edit</button>
        <button class="delete-btn" (click)="deleteMenu(m.menuItemID!)">Delete</button>
      </td>
    </tr>
  </tbody>
</table>

  `,
  styles: [`

        /* ===== MENU TABLE ===== */
.menu-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  font-family: Arial, sans-serif;
}

.menu-table th {
  background-color: #1976d2;
  color: white;
  padding: 10px;
  text-align: left;
}

.menu-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.menu-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.menu-table tbody tr:hover {
  background-color: #f1f1f1;
}

/* ===== ACTION BUTTONS ===== */
.edit-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-right: 6px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #125ea8;
}

.delete-btn:hover {
  background-color: #b71c1c;
}

    `]
})
export class MenuListComponent {

  //  use observable directly
  menus$: Observable<Menu[]>;

  constructor(private menuService: MenuService) {
    this.menus$ = this.menuService.menus$;
  }

  editMenu(menu: Menu): void {
    this.menuService.selectMenu(menu);
  }

  deleteMenu(id: number): void {
    if (confirm('Are you sure?')) {
      this.menuService.deleteMenu(id)
        .subscribe(() => this.menuService.notifyRefresh());
    }
  }
}
