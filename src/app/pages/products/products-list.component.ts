import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product, ProductService } from './product.service';
import { ProductUiService } from './product-ui.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { QueryParam, QueryParam1 } from 'src/app/helpers/base-api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-products',

  template: `
    <div class="inner-content">
      <div class="flex-column-gap">
        <div class="flex-row-gap">
          <div class="full-width-row">
            <app-filter-input
              (filterChanged)="
                searchText = $event; param.pageIndex = 1; search()
              "
            ></app-filter-input>

            <app-button-add-item
              [label]="'Add Product'"
              (clicked)="uiService.showAdd()"
            ></app-button-add-item>
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
                <td nzEllipsis>
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
  searchText: string = '';
  param: QueryParam1 = {
    pageIndex: 1,
    pageSize: 10,
    filters: '',
  };
  loading: boolean = false;
  private refreshSub$!: Subscription;

  constructor(
    private productsService: ProductService,
    public uiService: ProductUiService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.refreshSub$ = this.uiService.refresher.subscribe(() => this.search());
  }

  search() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const filters: any[] = [
        { field: 'name', operator: 'contains', value: this.searchText },
      ];
      this.param.filters = JSON.stringify(filters);
      this.productsService.search(this.param).subscribe({
        next: (response: any) => {
          setTimeout(() => {
            this.products = response.results;
            this.totalProducts = response.params.total;
            this.loading = false;
          }, 250);
        },
        error: (error: any) => {
          console.error('Error fetching products:', error);
          this.message.error('Failed to load products.');
          this.loading = false;
        },
      });
    }, 50);
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const { pageIndex, pageSize } = params;

    this.param.pageIndex = pageIndex;
    this.param.pageSize = pageSize;
    this.search();
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
