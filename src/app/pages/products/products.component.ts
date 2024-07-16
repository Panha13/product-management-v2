import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ProductInterface } from './product-interface';
import { ProductsService } from './products.service';
import { debounceTime, Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';

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
          <div nz-row nzAlign="middle">
            <app-search-input
              [(searchValue)]="searchValue"
              (searchValueChange)="onSearchInput($event)"
            ></app-search-input>
            <nz-select
              style="margin-left: 15px;"
              nzShowSearch
              nzAllowClear
              nzSize="large"
              nzPlaceHolder="Filter By Category"
              [(ngModel)]="selectedValue"
              (ngModelChange)="onCategoryChange($event)"
              [style]="{ width: '180px' }"
            >
              <nz-option
                *ngFor="let category of categories"
                [nzLabel]="category"
                [nzValue]="category"
              ></nz-option>
            </nz-select>
          </div>
          <app-button
            label="Add Product"
            [routerLink]="'/products/add'"
          ></app-button>
        </div>

        <div nz-row style=" flex-grow: 1; overflow: auto;">
          <nz-table
            #tableData
            nzShowPagination
            nzShowSizeChanger
            [nzPageIndex]="pageIndex"
            [nzPageSize]="pageSize"
            (nzPageIndexChange)="onPageIndexChange($event)"
            [nzData]="filterData"
            [nzLoading]="loading"
            nzTableLayout="fixed"
          >
            <thead>
              <tr style="position: sticky; top: 0; z-index: 100;">
                <th nzWidth="5%" style="text-align: center;">#</th>
                <th nzWidth="10%">Image</th>
                <th nzWidth="20%">Products Name</th>
                <th nzWidth="10%">Price</th>
                <th nzWidth="15%">Category</th>
                <th nzWidth="30%">Description</th>
                <th nzWidth="10%" style="text-align: center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of tableData.data; index as i">
                <td class="text-center">
                  {{ (pageIndex - 1) * pageSize + i + 1 }}
                </td>
                <td>
                  <img [src]="data.image" style="width: 50px; height: 50px;" />
                </td>
                <td nzEllipsis style="font-weight: 600;">{{ data.title }}</td>
                <td>{{ data.price | currency }}</td>
                <td nzEllipsis>{{ data.category }}</td>
                <td nzEllipsis>{{ data.description }}</td>
                <td>
                  <nz-row
                    nzJustify="center"
                    style="gap: 10px; flex-wrap: nowrap;"
                  >
                    <a
                      routerLink="/products/edit/{{ data.id }}"
                      nz-button
                      nzType="primary"
                      nzGhost
                    >
                      <span nz-icon nzType="edit"></span>
                    </a>
                    <button nz-button nzType="default" nzDanger>
                      <span
                        nz-icon
                        nzType="delete"
                        (click)="showConfirm(data.id)"
                      ></span>
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
  selectedValue: string | null = null;
  searchValue = '';
  dataSet: ProductInterface[] = [];
  filterData: ProductInterface[] = [];
  pageIndex = 1;
  pageSize = 10;
  loading = true;
  categories: string[] = [];

  private searchSubject = new Subject<string>();

  constructor(
    private _productsService: ProductsService,
    private modal: NzModalService
  ) {}
  ngOnInit(): void {
    this.loading = true;

    //Get products
    this._productsService.getProducts().subscribe((products) => {
      this.dataSet = products;
      this.filterData = [...this.dataSet];
      this.loading = false;

      this.categories = [
        ...new Set(products.map((product) => product.category)),
      ];
    });

    this.searchSubject.pipe(debounceTime(300)).subscribe((searchValue) => {
      this.searchValue = searchValue;
      this.onSearch();
    });
  }

  onSearchInput(searchValue: string): void {
    this.searchSubject.next(searchValue);
  }

  onCategoryChange(category: string): void {
    this.selectedValue = category;
    if (!category) {
      this.filterData = [...this.dataSet];
    } else {
      this.filterData = this.dataSet.filter(
        (item) => item.category === category
      );
    }
  }

  // Search function
  private onSearch(): void {
    if (!this.searchValue) {
      this.filterData = [...this.dataSet];
    } else {
      this.filterData = this.dataSet.filter(
        (item) =>
          item.title.toLowerCase().includes(this.searchValue.toLowerCase()) ||
          item.description
            .toLowerCase()
            .includes(this.searchValue.toLowerCase()) ||
          item.category.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
  }

  showConfirm(id: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this product?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.deleteProduct(id);
      },
      nzCancelText: 'No',
    });
  }

  deleteProduct(id: number): void {
    this.loading = true;
    this._productsService.deleteProduct(id).subscribe({
      next: (res) => {
        this.filterData = this.filterData.filter((item) => item.id !== id);
        // this.updateDisplayData();
        this.loading = false;
        console.log('Product deleted successfully!');
      },
      error: (error) => {
        this.loading = false;
        console.error('Failed to delete product:', error);
      },
    });
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
  }
}
