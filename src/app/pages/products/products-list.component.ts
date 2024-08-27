import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product, ProductService } from './product.service';
import { ProductUiService } from './product-ui.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { QueryParam } from 'src/app/helpers/base-api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-products',

  template: `
    <div class="inner-content">
      <div class="flex-column-gap">
        <div class="flex-row-gap">
          <div class="full-width-row">
            <app-search-input
              [placeholder]="'Search product here' | translate"
              [(searchQuery)]="param.searchQuery"
              (search)="onSearch($event)"
            ></app-search-input>

            <button
              nz-button
              nzType="primary"
              nzSize="large"
              nzGhost
              style="border-radius:10px;"
              (click)="uiService.showAdd()"
            >
              <span nz-icon nzType="plus"></span>
              {{ 'Add Product' | translate }}
            </button>
          </div>
        </div>
        <div nz-row class="flex-grow">
          <nz-table
            [nzData]="products"
            nzTableLayout="fixed"
            nzShowPagination
            nzShowSizeChanger
            [nzFrontPagination]="false"
            [nzPageIndex]="param.pageIndex"
            [nzPageSize]="param.pageSize"
            [nzTotal]="totalProducts"
            [nzLoading]="loading"
            (nzQueryParams)="onQueryParamsChange($event)"
          >
            <thead>
              <tr class="table-header">
                <th nzWidth="20%">{{ 'Product' | translate }}</th>
                <th nzWidth="10%">{{ 'Code' | translate }}</th>
                <th nzWidth="14%">{{ 'Price' | translate }}</th>
                <th nzWidth="10%" nzEllipsis>
                  {{ 'Quantity' | translate }}
                </th>
                <th nzWidth="12%">{{ 'Category' | translate }}</th>
                <th nzWidth="20%">{{ 'Description' | translate }}</th>
                <th nzWidth="14%">{{ 'Status' | translate }}</th>
                <th nzWidth="12%" [nzAlign]="'center'">
                  {{ 'Action' | translate }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of products">
                <td nzEllipsis class="font-semibold">
                  <img [src]="data.image" class="data-image" />
                  {{ data.name }}
                </td>
                <td nzEllipsis>#{{ data.code }}</td>
                <td>
                  {{ data.price | currency : 'USD' }}
                </td>
                <td>{{ data.stock_quantity }}</td>
                <td nzEllipsis>
                  {{ data.category ? data.category.name : '—' }}
                </td>
                <td nzEllipsis>
                  {{ data.description ? data.description : '—' }}
                </td>
                <td>
                  <nz-tag [nzColor]="data.stock_quantity! > 0 ? 'green' : 'red'"
                    >{{
                      data.stock_quantity! > 0
                        ? ('In stock' | translate)
                        : ('Out of stock' | translate)
                    }}
                  </nz-tag>
                </td>

                <td>
                  <nz-row class="action-buttons">
                    <button
                      nz-button
                      nzType="primary"
                      nzGhost
                      (click)="uiService.showEdit(data.product_id || 0)"
                    >
                      <span nz-icon nzType="edit"></span>
                    </button>
                    <button
                      nz-button
                      nzType="default"
                      nzDanger
                      (click)="uiService.showDelete(data.product_id || 0)"
                    >
                      <span nz-icon nzType="delete"></span>
                    </button>
                  </nz-row>
                </td>
              </tr>
            </tbody>
          </nz-table>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host
        ::ng-deep
        .ant-select:not(.ant-select-customize-input)
        .ant-select-selector {
        border-radius: 10px;
        text-align: center;
      }
    `,
  ],
  // encapsulation: ViewEncapsulation.Emulated,
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  totalProducts: number = 0;
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 10,
    searchQuery: '',
  };
  loading: boolean = false;
  private searchSubject = new Subject<string>();
  private refreshSub$!: Subscription;

  constructor(
    private productsService: ProductService,
    public uiService: ProductUiService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    this.searchSubject
      .pipe(debounceTime(300))
      .subscribe(() => this.loadProducts());

    this.refreshSub$ = this.uiService.refresher.subscribe(() =>
      this.loadProducts()
    );
  }

  loadProducts(): void {
    this.loading = true;
    this.productsService.getAll(this.param).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.products = response.data;
          this.totalProducts = response.total;
          this.loading = false;
        }, 250);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.message.error('Failed to load products.');
        this.loading = false;
      },
    });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const { pageIndex, pageSize } = params;

    this.param.pageIndex = pageIndex;
    this.param.pageSize = pageSize;
    this.loadProducts();
  }
  onSearch(query: string): void {
    this.param.pageIndex = 1; // Reset to first page on search
    this.param.searchQuery = query;
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
