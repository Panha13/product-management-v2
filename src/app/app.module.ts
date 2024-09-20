import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N, NzI18nInterface, km_KH, en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Ng Zorro Modules
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAlertModule } from 'ng-zorro-antd/alert';

// Components
import { ProductsListComponent } from './pages/products/products-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoryListComponent } from './pages/categories/category-list.component';
import { OrderComponent } from './pages/order/order.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ProductOperationComponent } from './pages/products/product-operation.component';
import { SearchInputComponent } from './shared/components/search-input.component';
import { UnitListComponent } from './pages/units/unit-list.component';
import { CategorySelectComponent } from './pages/categories/category-select.component';
import { UnitSelectComponent } from './pages/units/unit-select.component';
import { CategoryOperationComponent } from './pages/categories/category-operation.component';
import { ProductDeleteComponent } from './pages/products/product-delete.component';
import { CategoryDeleteComponent } from './pages/categories/category-delete.component';
import { UnitOperationComponent } from './pages/units/unit-operation.component';
import { UnitDeleteComponent } from './pages/units/unit-delete.component';
import { UserListComponent } from './pages/user/user-list.component';
import { LayoutComponent } from './pages/layout.component';
import { LoginComponent } from './auth/login.component';
import { ButtonAddItemComponent } from './shared/components/button-add-item.component';
import { CustomerListComponent } from './pages/customers/customer-list.component';

// Pipes
import { CurrencyPipe } from './pipes/currency.pipe';

// Translations
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpRequestInterceptor } from './helpers/http.interceptor';
import { FilterInputComponent } from './shared/components/filter-input.component';

registerLocaleData(en);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function i18nFactory(): NzI18nInterface {
  const storedLang = localStorage.getItem('selectedLang') || 'en';
  return storedLang === 'km' ? km_KH : en_US;
}

@NgModule({
  declarations: [
    AppComponent,
    ProductsListComponent,
    DashboardComponent,
    CategoryListComponent,
    OrderComponent,
    PageNotFoundComponent,
    ProductOperationComponent,
    SearchInputComponent,
    UnitListComponent,
    CategorySelectComponent,
    UnitSelectComponent,
    CurrencyPipe,
    ProductDeleteComponent,
    LayoutComponent,
    CategoryOperationComponent,
    CategoryDeleteComponent,
    UnitOperationComponent,
    UnitDeleteComponent,
    UserListComponent,
    LoginComponent,
    ButtonAddItemComponent,
    FilterInputComponent,
    CustomerListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
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
    NzMessageModule,
    NzModalModule,
    NzIconModule,
    NzTagModule,
    NzInputNumberModule,
    NzNotificationModule,
    NzCheckboxModule,
    NzAlertModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: NZ_I18N, useFactory: i18nFactory },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
