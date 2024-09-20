import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoryListComponent } from './pages/categories/category-list.component';
import { OrderComponent } from './pages/order/order.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UnitListComponent } from './pages/units/unit-list.component';
import { UserListComponent } from './pages/user/user-list.component';
import { LayoutComponent } from './pages/layout.component';
import { ProductsListComponent } from './pages/products/products-list.component';
import { LoginComponent } from './auth/login.component';
import { authGuard } from './auth/auth.guard';
import { authRedirectGuard } from './auth/auth-redirect.guard';
import { CustomerListComponent } from './pages/customers/customer-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authRedirectGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard',
          breadcrumb: 'Dashboard',
        },
      },
      {
        path: 'products',
        component: ProductsListComponent,
        data: { title: 'Products', breadcrumb: 'Products' },
      },

      {
        path: 'categories',
        component: CategoryListComponent,
        data: { title: 'Categories', breadcrumb: 'Categories' },
      },
      {
        path: 'units',
        component: UnitListComponent,
        data: { title: 'Units', breadcrumb: 'Units' },
      },
      {
        path: 'order',
        component: OrderComponent,
        data: { title: 'Order', breadcrumb: 'Order' },
      },
      {
        path: 'user',
        component: UserListComponent,
        data: { title: 'User', breadcrumb: 'User' },
      },
      {
        path: 'customers',
        component: CustomerListComponent,
        data: { title: 'customers', breadcrumb: 'customers' },
      },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
