import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

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
          <div nz-row nzAlign="middle"></div>

          <div nz-row style=" flex-grow: 1; overflow: auto;"></div>
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
  constructor() {}
  ngOnInit(): void {}
}
