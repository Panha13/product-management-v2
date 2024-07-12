import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductsService } from '../products/products.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProductInterface } from '../products/product-interface';
import { CategoriesService } from './categories.service';
import { Category } from './categories';

interface ItemData {
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-categories',
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
          </div>
          <app-button
            label="Add Product"
            [routerLink]="'/products/add'"
          ></app-button>
        </div>

        <div nz-row style=" flex-grow: 1; overflow: auto;">
          <nz-table
            #cateTable
            [nzData]="categoryList"
            nzTableLayout="fixed"
            nzShowPagination
            [nzPageIndex]="pageIndex"
            [nzPageSize]="pageSize"
            [nzLoading]="loading"
            (nzPageIndexChange)="onPageIndexChange($event)"
          >
            <thead>
              <tr style="position: sticky; top: 0; z-index: 100;">
                <th nzWidth="5%" style="text-align: center;">#</th>
                <th nzWidth="20%">Category Name</th>
                <th style="text-align: center;">Quantity</th>
                <th>Start Date</th>
                <th style="text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of cateTable.data; index as i">
                <td class="text-center">
                  {{ (pageIndex - 1) * pageSize + i + 1 }}
                </td>
                <td style="font-weight: 600;">{{ data.categoryName }}</td>
                <td class="text-center">{{ data.quantity }}</td>
                <td>20 Nov 2023</td>
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
      .text-center {
        text-align: center;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CategoriesComponent implements OnInit {
  searchValue: string = '';
  categoryList: Category[] = [];
  filterData: ProductInterface[] = [];
  pageIndex = 1;
  pageSize = 10;
  loading = true;

  constructor(private _categoriesService: CategoriesService) {}
  ngOnInit(): void {
    this._categoriesService
      .getCategoriesWithCount()
      .subscribe((data: Category[]) => {
        this.categoryList = data;
        this.loading = false;
      });
  }

  onSearchInput(searchValue: string): void {
    this.searchValue = searchValue;
  }
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
  }
}
