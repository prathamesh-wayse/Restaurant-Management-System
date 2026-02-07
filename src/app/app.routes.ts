import { Routes } from '@angular/router';
import { CustomersPageComponent } from './customers/customers-page.component';
import { EmployeesPageComponent } from './employees/employees-page.component';
import { MenuPageComponent } from './menu/menu-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },

  { path: 'customers', component: CustomersPageComponent },
  { path: 'employees', component: EmployeesPageComponent },
  { path: 'menu', component: MenuPageComponent },

  {
  path: 'orders',
  loadComponent: () =>
    import('./order/order-page.component')
      .then(m => m.OrderPageComponent)
},
{
  path: 'orders/:id',
  loadComponent: () =>
    import('./order-details/order-details-list.component')
      .then(m => m.OrderDetailsListComponent)
},

{
  path: 'sales',
  loadComponent: () =>
    import('./sales/sales-page.component')
      .then(m => m.SalesPageComponent)
}


];
