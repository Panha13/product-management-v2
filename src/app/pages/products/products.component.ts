import { Component, OnInit, Output } from '@angular/core';

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
          <div nz-row nzAlign="middle"></div>

          <div nz-row style=" flex-grow: 1; overflow: auto;"></div>
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
  constructor() {}
  ngOnInit(): void {}
}
