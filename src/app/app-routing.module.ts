import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { OrderComponent } from './pages/order/order.component';
import { UserComponent } from './pages/user/user.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UnitsComponent } from './pages/units/units.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/products' },
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
    data: { title: 'Products', breadcrumb: 'Products' },
    children: [
      {
        path: '',
        component: ProductsComponent,
      },
    ],
  },

  {
    path: 'categories',
    component: CategoriesComponent,
    data: { title: 'Categories', breadcrumb: 'Categories' },
  },
  {
    path: 'units',
    component: UnitsComponent,
    data: { title: 'Units', breadcrumb: 'Units' },
  },
  {
    path: 'order',
    component: OrderComponent,
    data: { title: 'Order', breadcrumb: 'Order' },
  },
  {
    path: 'user',
    component: UserComponent,
    data: { title: 'User', breadcrumb: 'User' },
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
