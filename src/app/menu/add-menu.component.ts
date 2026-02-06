import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { Menu } from "../models/menu.model";
import { MenuService } from "../services/menu.service";

@Component({
  selector: 'app-add-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
    <h2>Add / Edit Menu</h2>

    <!-- Angular template-driven form -->
    <form class="menu-form" (ngSubmit)="onSubmit()" #menuForm="ngForm">

      <label>Name</label>
      <input
        type="text"
        name="name"
        [(ngModel)]="menu.name"
        required>

      <label>Description</label>
      <input
        type="text"
        name="description"
        [(ngModel)]="menu.description"
        required>

      <label>Category</label>
      <input
        type="text"
        name="category"
        [(ngModel)]="menu.category"
        required>

      <label>Price</label>
      <input
        type="number"
        name="price"
        [(ngModel)]="menu.price"
        required>

      <button type="submit">
        {{ menu.menuItemID ? 'Update Menu' : 'Add Menu' }}
      </button>

    </form>
  `,

  styles: [`
    /* ===== FORM ===== */
    .menu-form {
      max-width: 400px;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
      margin-bottom: 20px;
    }

    h2 {
      margin-bottom: 15px;
      color: #1976d2;
    }

    /* ===== LABEL ===== */
    label {
      font-weight: 600;
      margin-bottom: 4px;
      display: block;
    }

    /* ===== INPUT ===== */
    input {
      width: 100%;
      padding: 8px 10px;
      margin-bottom: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }

    input:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 3px rgba(25,118,210,0.4);
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
export class AddMenuComponent implements OnInit, OnDestroy {

  // Holds form data (Add + Edit)
  menu: Menu = {
    name: '',
    description: '',
    category: '',
    price: 0
  };

  private subscription!: Subscription;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    // Listen for Edit selection
    this.subscription = this.menuService.selectedMenu$
      .subscribe(m => {
        if (m) {
          this.menu = { ...m };
        }
      });
  }

  onSubmit(): void {

    // UPDATE
    if (this.menu.menuItemID) {
      this.menuService.updateMenu(this.menu).subscribe({
        next: () => {
          alert('Menu Updated Successfully');
          this.afterSave();
        },
        error: err => {
          console.error(err);
          alert('Error Updating Menu');
        }
      });
    }

    // ADD
    else {
      this.menuService.addMenu(this.menu).subscribe({
        next: () => {
          alert('Menu Added Successfully');
          this.afterSave();
        },
        error: err => {
          console.error(err);
          alert('Error Adding Menu');
        }
      });
    }
  }

  afterSave(): void {
    this.menuService.notifyRefresh();

    // Reset form
    this.menu = {
      name: '',
      description: '',
      category: '',
      price: 0
    };
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
