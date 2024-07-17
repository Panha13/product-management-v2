import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { AttributeComponent } from './pages/attribute/attribute.component';
import { OrderComponent } from './pages/order/order.component';
import { UserComponent } from './pages/user/user.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AddUpdateProductComponent } from './pages/products/add-update-product.component';

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
      {
        path: 'add',
        component: AddUpdateProductComponent,
        data: { title: 'Add Product', breadcrumb: 'Add Product' },
      },
      {
        path: 'edit/:id',
        component: AddUpdateProductComponent,
        data: { title: 'Update Product', breadcrumb: 'Update Product' },
      },
    ],
  },

  {
    path: 'categories',
    component: CategoriesComponent,
    data: { title: 'Categories', breadcrumb: 'Categories' },
  },
  {
    path: 'attributes',
    component: AttributeComponent,
    data: { title: 'Attributes', breadcrumb: 'Attributes' },
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
