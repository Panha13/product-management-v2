import { Component, OnInit, Output } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product';

@Component({
  selector: 'app-products',

  template: `
    <div class="inner-content">
      <div
        style="display: flex; flex-direction: column;  gap: 15px; height: 100%; "
      >
        <div
          nz-row
          nzJustify="space-between"
          nzAlign="middle"
          style="flex-shrink: 0;"
        >
          <div
            nz-row
            nzAlign="middle"
            nzJustify="space-between"
            style=" width:100%"
          >
            <div nz-col nzSpan="8">
              <nz-input-group [nzSuffix]="suffixIconSearch">
                <input
                  type="text"
                  nz-input
                  placeholder="Search product here..."
                />
              </nz-input-group>
              <ng-template #suffixIconSearch>
                <span style="font-size: 18px;" nz-icon nzType="search"></span>
              </ng-template>
            </div>
            <button nz-button nzType="primary" nzSize="large" nzGhost>
              <span nz-icon nzType="plus"></span>
              Add Product
            </button>
          </div>
        </div>
        <div nz-row style=" flex-grow: 1; overflow: auto;">
          <nz-table
            #basicTable
            [nzData]="products"
            nzTableLayout="fixed"
            nzShowPagination
            nzShowSizeChanger
            [nzPageIndex]="pageIndex"
            [nzPageSize]="pageSize"
            (nzPageIndexChange)="onPageIndexChange($event)"
            [nzLoading]="loading"
            nzTableLayout="fixed"
          >
            <thead>
              <tr style="position: sticky; top: 0; z-index: 100;">
                <th nzWidth="20%">Product</th>
                <th>Product ID</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Status</th>
                <th style="text-align:center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of basicTable.data">
                <td nzEllipsis class="font-semibold">
                  <img [src]="data.image" class="data-image" />
                  {{ data.product_name }}
                </td>
                <td nzEllipsis>#{{ data.product_id }}</td>
                <td>
                  {{ data.price | currency : 'USD' }}
                </td>
                <td>{{ data.stock_quantity }}</td>
                <td>{{ data.category || 'No category' }}</td>
                <td>
                  <nz-tag [nzColor]="data.stock_quantity > 0 ? 'green' : 'red'"
                    >{{ data.stock_quantity > 0 ? 'In stock' : 'Out of stock' }}
                  </nz-tag>
                </td>
                <td>
                  <nz-row
                    nzJustify="center"
                    style="gap: 10px; flex-wrap: nowrap;"
                  >
                    <a nz-button nzType="primary" nzGhost>
                      <span nz-icon nzType="edit"></span>
                    </a>
                    <button nz-button nzType="default" nzDanger>
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
      nz-input-group {
        border-radius: 10px;
        padding: 8px;
        width: 420px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .showing {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .truncate {
        max-width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        /* display: inline-block;
        vertical-align: top; */
      }

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
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  pageIndex = 1;
  pageSize = 10;
  loading = true;

  constructor(private productsService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.products = data;
          this.loading = false;
        }, 250);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.loading = false;
      },
    });
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadProducts();
  }
}
