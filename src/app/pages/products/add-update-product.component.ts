import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-add-update-product',
  template: `
    <div nz-row nzJustify="center">
      <form
        nz-form
        [nzLayout]="'vertical'"
        style="width: 600px; background-color: #fff; padding: 40px; border-radius: 15px;"
      >
        <nz-form-item>
          <nz-form-label nzFor="product-name" class="required-marker" nzRequired
            >Product Name</nz-form-label
          >
          <nz-form-control>
            <input nz-input name="product-name" type="text" id="product-name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzFor="email">Image Link</nz-form-label>
          <nz-form-control>
            <input nz-input name="name" type="text" id="name" />
          </nz-form-control>
        </nz-form-item>
        <div nz-row nzGutter="16">
          <div nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label nzFor="email">Category</nz-form-label>
              <nz-form-control>
                <nz-select
                  nzShowSearch
                  nzAllowClear
                  nzPlaceHolder="Select category"
                  [(ngModel)]="selectedValue"
                  name="category"
                >
                  <nz-option nzLabel="Jack" nzValue="jack"></nz-option>
                  <nz-option nzLabel="Lucy" nzValue="lucy"></nz-option>
                  <nz-option nzLabel="Tom" nzValue="tom"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label nzFor="email">Price</nz-form-label>
              <nz-form-control>
                <input nz-input name="name" type="number" id="name" />
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>
        <nz-form-item>
          <nz-form-label nzFor="email">Decsription</nz-form-label>
          <nz-form-control>
            <textarea
              nz-input
              placeholder="Controlled autosize"
              [nzAutosize]="{ minRows: 3, maxRows: 5 }"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button
            nz-button
            nzType="default"
            type="button"
            routerLink="/products"
          >
            Back
          </button>
          <button nz-button nzType="primary" type="submit">Add Product</button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      nz-form-label {
        font-weight: bold;
      }
      .required-marker::after {
        content: '*';
        color: red;
        margin-left: 5px;
      }
    `,
  ],
  // encapsulation: ViewEncapsulation.None,
})
export class AddUpdateProductComponent implements OnInit {
  selectedValue = null;

  constructor() {}

  ngOnInit() {}
}
