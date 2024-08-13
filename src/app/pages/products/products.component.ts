import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product';
import { ProductUiService } from './product-ui.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { PaginationService } from 'src/app/helpers/pagination.service';

@Component({
  selector: 'app-products',

  template: `
    <div class="inner-content">
      <div class="flex-column-gap">
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
            <app-search-input
              [placeholder]="'Search product here...'"
              [(searchQuery)]="searchQuery"
              (search)="onSearch($event)"
            ></app-search-input>

            <button
              nz-button
              nzType="primary"
              nzSize="large"
              nzGhost
              style="border-radius:10px;"
              (click)="addProduct()"
            >
              <span nz-icon nzType="plus"></span>
              Add Product
            </button>
          </div>
        </div>
        <div nz-row style=" flex-grow: 1; overflow: auto;">
          <nz-table
            [nzData]="products"
            nzTableLayout="fixed"
            nzShowPagination
            nzShowSizeChanger
            [nzFrontPagination]="false"
            [nzPageIndex]="pageIndex"
            [nzPageSize]="pageSize"
            [nzTotal]="totalProducts"
            (nzPageIndexChange)="onPageIndexChange($event)"
            (nzPageSizeChange)="onPageSizeChange($event)"
            [nzLoading]="loading"
          >
            <thead>
              <tr style="position: sticky; top: 0; z-index: 100;">
                <th nzWidth="20%">Product</th>
                <th>Code</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Status</th>
                <th style="text-align:center">Action</th>
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
                <td>
                  {{ data.category ? data.category.name : '—' }}
                </td>
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
                    <button
                      nz-button
                      nzType="primary"
                      nzGhost
                      (click)="editProduct(data)"
                    >
                      <span nz-icon nzType="edit"></span>
                    </button>
                    <button
                      nz-button
                      nzType="default"
                      nzDanger
                      (click)="showDelete(data)"
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
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  totalProducts: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  loading: boolean = false;
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  private refreshSub$!: Subscription;

  constructor(
    private productsService: ProductService,
    private productUiService: ProductUiService,
    private message: NzMessageService,
    private paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.pageIndex = this.paginationService.getPageIndex();
    this.pageSize = this.paginationService.getPageSize();
    this.loadProducts();

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.loadProducts();
    });

    this.refreshSub$ = this.productUiService.refresher.subscribe(() => {
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productsService
      .getProducts(this.pageIndex, this.pageSize, this.searchQuery)
      .subscribe({
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

  //Modal
  addProduct(): void {
    this.productUiService.showAdd();
  }

  editProduct(product: Product): void {
    this.productUiService.showEdit(product);
  }

  showDelete(product: Product): void {
    this.productUiService.showDelete(product);
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.paginationService.setPageIndex(pageIndex);
    this.loadProducts();
  }
  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1; // Reset page index to 1 when page size changes
    this.paginationService.setPageSize(pageSize);
    this.loadProducts();
  }
  onSearch(query: string): void {
    this.pageIndex = 1; // Reset to first page on search
    this.searchQuery = query;
    this.loadProducts();
  }
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch(this.searchQuery);
    }
  }

  ngOnDestroy(): void {
    this.refreshSub$.unsubscribe();
    this.paginationService.clearPaginationState();
  }
}
