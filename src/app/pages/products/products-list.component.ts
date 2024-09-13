import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product, ProductService } from './product.service';
import { ProductUiService } from './product-ui.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { QueryParam } from 'src/app/helpers/base-api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-products',

  template: `
    <div class="inner-content">
      <div class="flex-column-gap">
        <div class="flex-row-gap">
          <div class="full-width-row">
            <div style="display: flex; align-items: center; gap: 10px;">
              <app-filter-input
                [placeholder]="'Search product here' | translate"
                (filterChanged)="
                  searchText = $event; param.pageIndex = 1; search()
                "
              ></app-filter-input>
              <app-category-select
                [showAllOption]="true"
                (valueChanged)="
                  categoryId = $event; param.pageIndex = 1; search()
                "
              ></app-category-select>
            </div>

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
  styles: [``],
  // encapsulation: ViewEncapsulation.Emulated,
})
export class ProductsListComponent implements OnInit, OnDestroy {
  constructor(
    private productsService: ProductService,
    public uiService: ProductUiService,
    private message: NzMessageService
  ) {}

  products: Product[] = [];
  totalProducts: number = 0;
  categoryId: number = 0;
  searchText: string = '';
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 10,
    filters: '',
  };
  loading: boolean = false;
  private refreshSub$!: Subscription;

  ngOnInit(): void {
    this.refreshSub$ = this.uiService.refresher.subscribe(() => this.search());
  }

  search(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const filters: any[] = [
        { field: 'name', operator: 'contains', value: this.searchText },
      ];
      if (this.categoryId) {
        filters.push({
          field: 'category_id',
          operator: 'eq',
          value: this.categoryId,
        });
      }
      this.param.filters = JSON.stringify(filters);
      this.productsService.search(this.param).subscribe({
        next: (response: any) => {
          this.products = response.results;
          this.totalProducts = response.params.total;
          this.loading = false;
        },
        error: (error: any) => {
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
