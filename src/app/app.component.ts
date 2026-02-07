import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <!-- NAVBAR -->
  <nav class="navbar">
    <div class="nav-inner">
      <div class="brand">
        Aai Ekvira Restaurant
      </div>

      <ul class="nav-links">
        <li><a routerLink="/customers" routerLinkActive="active">Customers</a></li>
        <li><a routerLink="/employees" routerLinkActive="active">Employees</a></li>
        <li><a routerLink="/menu" routerLinkActive="active">Menu</a></li>
        <li>  <a routerLink="/orders" routerLinkActive="active">Orders</a></li>
        
        
        <li><a routerLink="/sales">Sales</a></li>
      </ul>
    </div>
  </nav>

  <div class="container">
    <router-outlet></router-outlet>
  </div>
`,
styles: [`
  /* ===== NAVBAR ===== */
  .navbar {
    background-color: #2f2f2f;
  }

  /* CENTER CONTENT */
  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    font-size: 20px;
    font-weight: bold;
    color: white;
  }

  .nav-links {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
  }

  .nav-links li {
    margin-left: 20px;
  }

  .nav-links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
  }

  .nav-links a.active {
    border-bottom: 2px solid #fff;
    padding-bottom: 4px;
  }

  .nav-links a.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  /* PAGE CONTENT */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  `]
})
export class AppComponent {}
