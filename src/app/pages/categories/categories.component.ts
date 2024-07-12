import { Component, OnInit, ViewEncapsulation } from '@angular/core';

interface ItemData {
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-categories',
  template: `
    <div class="inner-content">
      <div nz-row style="flex-direction: column; gap: 25px; ">
        <nz-table
          #headerTable
          [nzData]="listOfData"
          [nzPageSize]="50"
          [nzScroll]="{ y: '50vh' }"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th nzWidth="100px">Age</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of headerTable.data">
              <td>{{ data.name }}</td>
              <td>{{ data.age }}</td>
              <td>{{ data.address }}</td>
            </tr>
          </tbody>
        </nz-table>
      </div>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class CategoriesComponent implements OnInit {
  listOfData: ItemData[] = [];

  ngOnInit(): void {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
      });
    }
    this.listOfData = data;
  }
}
