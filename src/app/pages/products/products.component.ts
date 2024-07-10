import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ProductInterface } from './product-interface';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',

  template: `
    <div class="inner-content">
      <div nz-row style="flex-direction: column; gap: 25px; ">
        <div nz-row nzJustify="space-between" nzAlign="middle">
          <div nz-row nzAlign="middle">
            <div class="showing">
              Showing
              <nz-select
                [ngModel]="pageSize"
                (ngModelChange)="onPageSizeChange($event)"
              >
                <nz-option
                  *ngFor="let size of [10, 20, 30]"
                  [nzValue]="size"
                  [nzLabel]="size"
                ></nz-option>
              </nz-select>
              entries
            </div>
            <app-search-input style="margin-left: 20px;"></app-search-input>
          </div>
          <app-button
            label="Add Product"
            [routerLink]="'/products/add'"
          ></app-button>
        </div>
        <!-- <nz-table #basicTable nzShowPagination nzShowSizeChanger [nzData]="dataSet"> -->
        <nz-table
          nzShowPagination="false"
          [nzData]="dataDisplay"
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
            <tr *ngFor="let data of dataDisplay">
              <td class="text-center">{{ data.id }}</td>
              <td>
                <img [src]="data.image" style="width: 50px; height: 50px;" />
              </td>
              <td nzEllipsis>{{ data.title }}</td>
              <td>{{ data.price | currency }}</td>
              <td nzEllipsis>{{ data.category }}</td>
              <td nzEllipsis>{{ data.description }}</td>
              <td>
                <nz-row nzJustify="center" style="gap: 10px;">
                  <button nz-button nzType="primary" nzGhost>
                    <span nz-icon nzType="edit"></span>
                  </button>
                  <button nz-button nzType="default" nzDanger>
                    <span nz-icon nzType="delete"></span>
                  </button>
                </nz-row>
              </td>
            </tr>
          </tbody>
        </nz-table>
        <div nz-row nzJustify="space-between" nzAlign="middle">
          <p style="margin: 0; color: #95989d;">
            Showing {{ dataDisplay.length }} entries
          </p>
          <nz-pagination
            [nzTotal]="dataSet.length"
            [nzPageIndex]="pageIndex"
            [nzPageSize]="pageSize"
            (nzPageIndexChange)="onIndexChange($event)"
            (nzPageSizeChange)="onPageSizeChange($event)"
            [nzTotal]="dataSet.length"
          ></nz-pagination>
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
        width: 70px;
        text-align: center;
      }
      .text-center {
        text-align: center;
      }
      ::ng-deep .ant-table-thead > tr > th {
        background-color: #f7f9fb;
        font-weight: 700;
        padding: 12px;
        border-bottom: none;
      }
      ::ng-deep
        .ant-table-container
        table
        > thead
        > tr:first-child
        th:first-child {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }
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

      ::ng-deep .ant-table-container table > tbody > tr:nth-child(odd) {
        background-color: #f7f9fb;
      }

      ::ng-deep .ant-table-container table > tbody > tr > td:first-child {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }
      ::ng-deep .ant-table-container table > tbody > tr > td:last-child {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }
      ::ng-deep .ant-table-container table > tbody > tr > td {
        border-bottom: none;
      }

      ::ng-deep .ant-table table {
        border-collapse: separate;
        border-spacing: 0px 10px;
      }

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
  // encapsulation: ViewEncapsulation.Emulated,
})
export class ProductsComponent implements OnInit {
  dataSet: ProductInterface[] = [];
  dataDisplay: ProductInterface[] = [];
  pageIndex = 1;
  pageSize = 10;
  loading = true;

  constructor(private _productsService: ProductsService) {}
  ngOnInit(): void {
    this.loading = true;
    this._productsService.getProducts().subscribe((products) => {
      this.dataSet = products;
      this.updateDisplayData();
      console.log(this.dataSet.length);
      this.loading = false;
    });
    console.log(this.dataSet.length);
  }
  onIndexChange(index: number): void {
    this.pageIndex = index;
    this.updateDisplayData();
  }
  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.updateDisplayData();
  }
  private updateDisplayData(): void {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataDisplay = this.dataSet.slice(startIndex, endIndex);
  }
}
