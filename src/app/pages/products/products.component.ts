import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  template: `<div nz-row style="flex-direction: column; gap: 25px; ">
    <div nz-row nzJustify="space-between" nzAlign="middle">
      <div nz-row nzAlign="middle">
        <h1 style="margin: 0;">Products</h1>
        <app-search-input style="margin-left: 30px;"></app-search-input>
      </div>
      <button nz-button nzType="primary" nzGhost nzSize="large">
        <span nz-icon nzType="plus"></span>
        Add Product
      </button>
    </div>
    <!-- <nz-table #basicTable nzShowPagination nzShowSizeChanger [nzData]="dataSet"> -->
    <nz-table nzShowPagination="false" [nzData]="dataDisplay">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Age</th>
          <th>Address</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of dataDisplay; let i = index">
          <td>{{ (pageIndex - 1) * pageSize + i + 1 }}</td>
          <td>{{ data.name }}</td>
          <td>{{ data.age }}</td>
          <td>{{ data.address }}</td>
          <td>
            <a>Action 一 {{ data.name }}</a>
            <nz-divider nzType="vertical"></nz-divider>
            <a>Delete</a>
          </td>
        </tr>
      </tbody>
    </nz-table>
    <div nz-row nzJustify="space-between">
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
      <nz-pagination
        [nzTotal]="dataSet.length"
        [nzPageIndex]="pageIndex"
        [nzPageSize]="pageSize"
        (nzPageIndexChange)="onIndexChange($event)"
        (nzPageSizeChange)="onPageSizeChange($event)"
        [nzTotal]="dataSet.length"
      ></nz-pagination>
    </div>
  </div>`,
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
      ::ng-deep
        .ant-select:not(.ant-select-customize-input)
        .ant-select-selector {
        border-radius: 10px;
        width: 70px;
        text-align: center;
      }
    `,
  ],
})
export class ProductsComponent {
  selectedValue = '10';
  dataSet = [
    { name: 'John Doe', age: 30, address: '123 Main St' },
    { name: 'Jane Smith', age: 25, address: '456 Elm St' },
    { name: 'Michael Johnson', age: 28, address: '789 Pine Ave' },
    { name: 'Emily Davis', age: 32, address: '101 Oak Lane' },
    { name: 'William Brown', age: 27, address: '222 Cedar St' },
    { name: 'Sophia Wilson', age: 29, address: '333 Maple Ave' },
    { name: 'James Martinez', age: 31, address: '444 Birch Rd' },
    { name: 'Olivia Anderson', age: 26, address: '555 Spruce Ct' },
    { name: 'Daniel Thomas', age: 33, address: '666 Pinehurst Blvd' },
    { name: 'Isabella Garcia', age: 24, address: '777 Elmwood Dr' },
    { name: 'Ethan Lopez', age: 30, address: '888 Willow St' },
    { name: 'Ava Hernandez', age: 28, address: '999 Forest Rd' },
    { name: 'Alexander Martinez', age: 29, address: '111 Oakwood Ave' },
    { name: 'Mia Robinson', age: 31, address: '222 Cherry Ln' },
    { name: 'Noah Perez', age: 27, address: '333 Sycamore Blvd' },
    { name: 'Charlotte Adams', age: 26, address: '444 Cedarwood Rd' },
    { name: 'Liam Nguyen', age: 25, address: '555 Birch Ave' },
    { name: 'Amelia Rivera', age: 32, address: '666 Elm St' },
    { name: 'Benjamin Scott', age: 28, address: '777 Maple Ln' },
    { name: 'Evelyn Walker', age: 30, address: '888 Oak Ave' },
    { name: 'Sophie Baker', age: 29, address: '999 Pine St' },
    { name: 'Lucas White', age: 27, address: '888 Elm St' },
    { name: 'Lily Clark', age: 24, address: '777 Maple Ave' },
    { name: 'Jackson Green', age: 32, address: '666 Oakwood Rd' },
    { name: 'Grace Hill', age: 28, address: '555 Cedar Ln' },
    { name: 'Logan King', age: 30, address: '444 Birch Ave' },
    { name: 'Chloe Hall', age: 26, address: '333 Willow St' },
    { name: 'Ryan Ward', age: 31, address: '222 Forest Rd' },
    { name: 'Emma Reed', age: 27, address: '111 Sycamore Blvd' },
    { name: 'Jacob Cook', age: 25, address: '101 Cedarwood Rd' },
    { name: 'Avery Hill', age: 33, address: '123 Elm Ave' },
    { name: 'Mason Moore', age: 29, address: '456 Maple Ln' },
    { name: 'Harper Brooks', age: 28, address: '789 Oakwood Ave' },
    { name: 'Ella Bailey', age: 26, address: '101 Cherry Ln' },
    { name: 'Elijah Rogers', age: 30, address: '222 Birch Ave' },
    { name: 'Aiden Reed', age: 27, address: '333 Cedarwood Rd' },
    { name: 'Scarlett Ward', age: 31, address: '444 Elm St' },
    { name: 'Zoe Griffin', age: 25, address: '555 Maple Ave' },
    { name: 'Levi Harris', age: 32, address: '666 Oak Ln' },
    { name: 'Nora Turner', age: 29, address: '777 Pine St' },
  ];
  dataDisplay: { name: string; age: number; address: string }[] = [];
  pageIndex = 1;
  pageSize = 10;

  constructor() {
    this.dataDisplay = this.dataSet.splice(0, this.pageSize);
    console.log(this.dataDisplay.length);
    console.log(this.dataSet.length);
  }
  onIndexChange(index: number): void {
    this.pageIndex = index;
    this.updateDisplayData();
    // this.dataDisplay = this.dataSet.splice(
    //   (this.pageIndex - 1) * this.pageSize,
    //   this.pageSize
    // );
    // console.log(this.dataDisplay.length);
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
