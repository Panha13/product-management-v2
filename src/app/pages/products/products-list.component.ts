import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product, ProductService } from './product.service';
import { ProductUiService } from './product-ui.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { QueryParam } from 'src/app/helpers/base-api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseListComponent } from 'src/app/utils/components/base-list.component';

@Component({
  selector: 'app-products',

  template: `
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
              style="width:180px"
              class="custom"
              [size]="'large'"
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
          [nzData]="lists"
          nzTableLayout="fixed"
          nzShowPagination
          nzShowSizeChanger
          [nzFrontPagination]="false"
          [nzPageIndex]="param.pageIndex || 0"
          [nzPageSize]="param.pageSize || 0"
          [nzTotal]="total"
          [nzLoading]="loading"
          (nzQueryParams)="onQueryParamsChange($event)"
        >
          <thead>
            <tr class="table-header">
              <th nzWidth="20%">{{ 'Product' | translate }}</th>
              <th nzWidth="10%">
                {{ 'Code' | translate }}
              </th>
              <th nzWidth="14%" [nzSortFn]="true" nzColumnKey="price">
                {{ 'Price' | translate }}
              </th>
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
            <tr *ngFor="let data of lists">
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
                    (click)="uiService.showEdit(data.id || 0)"
                  >
                    <span nz-icon nzType="edit"></span>
                  </button>
                  <button
                    nz-button
                    nzType="default"
                    nzDanger
                    (click)="uiService.showDelete(data.id || 0)"
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
  `,
  styles: [
    `
      :host ::ng-deep .custom .ant-select-selector {
        border-radius: 10px;
      }
    `,
  ],
  // encapsulation: ViewEncapsulation.Emulated,
})
export class ProductsListComponent
  extends BaseListComponent<Product>
  implements OnDestroy
{
  constructor(
    service: ProductService,
    public uiService: ProductUiService,
    private message: NzMessageService
  ) {
    super(service);
  }

  categoryId: number = 0;
  override param: QueryParam = {
    ...this.param,
    sort: 'code-',
  };

  private refreshSub$!: Subscription;

  override ngOnInit(): void {
    this.refreshSub$ = this.uiService.refresher.subscribe(() => this.search());
  }

  override search(): void {
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
      this.service.search(this.param).subscribe({
        next: (response: any) => {
          this.lists = response.results;
          this.total = response.params.total;
          this.loading = false;
        },
        error: () => {
          this.message.error('Failed to load products.');
          this.loading = false;
        },
      });
    }, 50);
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
