import { Component, OnInit } from '@angular/core';
import { BaseListComponent } from 'src/app/utils/components/base-list.component';
import { Customer, CustomersService } from './customers.service';

@Component({
  selector: 'app-customer-list',
  template: `
    <div class="flex-column-gap">
      <div class="flex-row-gap">
        <div class="full-width-row">
          <app-filter-input
            [placeholder]="'Search units here' | translate"
            (filterChanged)="searchText = $event; param.pageIndex = 1; search()"
          ></app-filter-input>
          <app-button-add-item [label]="'Add Unit'"></app-button-add-item>
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
              <th nzWidth="50px">#</th>
              <th>{{ 'Image' | translate }}</th>
              <th>{{ 'Name' | translate }}</th>
              <th>{{ 'Code' | translate }}</th>
              <th>{{ 'Email' | translate }}</th>
              <th>{{ 'Phone' | translate }}</th>
              <th>{{ 'Customer type' | translate }}</th>
              <th>{{ 'Address' | translate }}</th>
              <th [nzAlign]="'center'">
                {{ 'Action' | translate }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of lists; let i = index">
              <td nzEllipsis>
                {{
                  ((this.param.pageIndex || 1) - 1) *
                    (this.param.pageSize || 10) +
                    i +
                    1
                }}
              </td>
              <td nzEllipsis>
                <img [src]="data.image" class="data-image" />
              </td>
              <td nzEllipsis>
                {{ data.name }}
              </td>
              <td nzEllipsis>
                {{ data.code }}
              </td>
              <td nzEllipsis>
                {{ data.email }}
              </td>
              <td nzEllipsis>
                {{ data.phone }}
              </td>
              <td nzEllipsis>
                {{ data.customerType?.name }}
              </td>
              <td nzEllipsis>
                {{ data.address ? data.address : '—' }}
              </td>

              <td>
                <nz-row class="action-buttons">
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
      </div>
    </div>
  `,
  styles: [],
})
export class CustomerListComponent extends BaseListComponent<Customer> {
  constructor(service: CustomersService) {
    super(service);
  }
}
