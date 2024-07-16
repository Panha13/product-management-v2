import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ProductsComponent } from './pages/products/products.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { AttributeComponent } from './pages/attribute/attribute.component';
import { OrderComponent } from './pages/order/order.component';
import { UserComponent } from './pages/user/user.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { SearchInputComponent } from './shared/components/search-input.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AddUpdateProductComponent } from './pages/products/add-update-product.component';
import { ButtonComponent } from './shared/components/button.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ReactiveFormsModule } from '@angular/forms';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { AddUserComponent } from './pages/user/add-user.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    DashboardComponent,
    CategoriesComponent,
    AttributeComponent,
    OrderComponent,
    UserComponent,
    PageNotFoundComponent,
    SearchInputComponent,
    ButtonComponent,
    AddUpdateProductComponent,
    AddUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzInputModule,
    NzDropDownModule,
    NzButtonModule,
    NzAvatarModule,
    NzBadgeModule,
    NzSelectModule,
    NzGridModule,
    NzTableModule,
    NzDividerModule,
    NzPaginationModule,
    NzResultModule,
    NzTypographyModule,
    NzFormModule,
    NzUploadModule,
    NzSpinModule,
    ReactiveFormsModule,
    NzMessageModule,
    NzModalModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
