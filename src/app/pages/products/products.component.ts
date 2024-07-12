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
      <div nz-row style="flex-direction: column; gap: 25px; ">
        <div nz-row nzJustify="space-between" nzAlign="middle">
          <div nz-row nzAlign="middle">
            <app-search-input
              [(searchValue)]="searchValue"
              (searchValueChange)="onSearchInput($event)"
            ></app-search-input>
          </div>
          <app-button
            label="Add Product"
            [routerLink]="'/products/add'"
          ></app-button>
        </div>
        <!-- <nz-table #basicTable nzShowPagination nzShowSizeChanger [nzData]="dataSet"> -->
        <nz-table
          #tableData
          nzShowPagination
          nzShowSizeChanger
          [nzData]="dataSet"
          [nzLoading]="loading"
          nzTableLayout="fixed"
        >
          <thead>
            <tr>
              <th nzWidth="5%" class="text-center">ID</th>
              <th nzWidth="10%">Image</th>
              <th nzWidth="20%">Products Name</th>
              <th nzWidth="10%">Price</th>
              <th nzWidth="15%">Category</th>
              <th nzWidth="30%">Description</th>
              <th nzWidth="10%" class="text-center">Actions</th>
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
              <td nzEllipsis>{{ data.title }}</td>
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
        <!-- <div nz-row nzJustify="space-between" nzAlign="middle">
          <p style="margin: 0; color: #95989d;">
            Showing {{ dataDisplay.length }} entries
          </p>
          <nz-pagination
            [nzTotal]="filterData.length"
            [nzPageIndex]="pageIndex"
            [nzPageSize]="pageSize"
            (nzPageIndexChange)="onIndexChange($event)"
            (nzPageSizeChange)="onPageSizeChange($event)"
            [nzTotal]="dataSet.length"
          ></nz-pagination>
        </div> -->
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
        width: 70px;
        text-align: center;
      }
      .text-center {
        text-align: center;
      }
      :host ::ng-deep .ant-table-thead > tr > th {
        background-color: #f7f9fb;
        font-weight: 700;
        padding: 12px;
        border-bottom: none;
      }
      :host
        ::ng-deep
        .ant-table-container
        table
        > thead
        > tr:first-child
        th:first-child {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }
      :host
        ::ng-deep
        .ant-table-container
        table
        > thead
        > tr:first-child
        th:last-child {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }
      /* ::ng-deep .ant-table-container table > thead > tr > th {
        margin-bottom: 10px;
      } */

      :host ::ng-deep .ant-table-container table > tbody > tr:nth-child(odd) {
        background-color: #f7f9fb;
      }

      :host ::ng-deep .ant-table-container table > tbody > tr > td:first-child {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }
      :host ::ng-deep .ant-table-container table > tbody > tr > td:last-child {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }
      :host ::ng-deep .ant-table-container table > tbody > tr > td {
        border-bottom: none;
      }

      :host ::ng-deep .ant-table table {
        border-collapse: separate;
        border-spacing: 0px 10px;
      }

      :host
        ::ng-deep
        .ant-table-thead
        > tr
        > th:not(:last-child):not(.ant-table-selection-column):not(
          .ant-table-row-expand-icon-cell
        ):not([colspan])::before {
        content: none;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ProductsComponent implements OnInit {
  searchValue = '';
  dataSet: ProductInterface[] = [];
  dataDisplay: ProductInterface[] = [];
  filterData: ProductInterface[] = [];
  pageIndex = 1;
  pageSize = 10;
  loading = true;

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
      // this.updateDisplayData();
      this.loading = false;
    });

    this.searchSubject.pipe(debounceTime(300)).subscribe((searchValue) => {
      this.searchValue = searchValue;
      this.onSearch();
    });
  }

  onSearchInput(searchValue: string): void {
    this.searchSubject.next(searchValue);
  }
  // Search function
  private onSearch(): void {
    if (!this.searchValue) {
      // If searchValue is empty, reset filterData to all products
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
    this.pageIndex = 1; // Reset pageIndex to show first page of filtered results
  }

  //Pagination
  // onIndexChange(index: number): void {
  //   this.pageIndex = index;
  //   this.updateDisplayData();
  // }

  // //Pagination
  // onPageSizeChange(pageSize: number): void {
  //   this.pageSize = pageSize;
  //   this.pageIndex = 1;
  //   this.updateDisplayData();
  // }

  //Pagination
  // private updateDisplayData(): void {
  //   const startIndex = (this.pageIndex - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;

  //   this.dataDisplay = this.filterData.slice(startIndex, endIndex);
  // }

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
}
