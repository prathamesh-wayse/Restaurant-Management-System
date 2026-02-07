import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddMenuComponent } from "./add-menu.component";
import { MenuListComponent } from "./menu-list.component";

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [CommonModule, AddMenuComponent, MenuListComponent],

  template: `
    <h1>Menu</h1>

    <app-add-menu></app-add-menu>
    <hr>
    <app-menu-list></app-menu-list>
  `
})
export class MenuPageComponent {}
