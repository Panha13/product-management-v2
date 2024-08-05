import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from './product';
import { ProductService } from './product.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/category';
import { Unit, UnitsService } from '../units/units.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductUiService } from './product-ui.service';

@Component({
  selector: 'app-product-operation',
  template: `
    <div nz-row nzJustify="center">
      <form
        class="form-container"
        nz-form
        [nzLayout]="'vertical'"
        [formGroup]="form"
      >
        <nz-form-item>
          <nz-form-label nzFor="name" class="required-marker"
            >Product Name</nz-form-label
          >
          <nz-form-control
            [nzErrorTip]="
              form.get('name')?.hasError('required')
                ? 'Please enter product name'
                : ''
            "
          >
            <input
              nz-input
              placeholder="Enter product name"
              formControlName="name"
              type="text"
              id="name"
              autocomplete="true"
            />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzFor="image" class="required-marker"
            >Image Link</nz-form-label
          >
          <nz-form-control
            [nzErrorTip]="
              form.get('image')?.hasError('required')
                ? 'Please enter image link'
                : ''
            "
          >
            <input
              nz-input
              placeholder="Enter image link"
              formControlName="image"
              type="text"
              id="image"
            />
          </nz-form-control>
        </nz-form-item>
        <div nz-row nzGutter="16">
          <div nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label>Category</nz-form-label>
              <nz-form-control>
                <nz-select
                  id="category_id"
                  nzShowSearch
                  nzAllowClear
                  nzPlaceHolder="Select category"
                  formControlName="category_id"
                >
                  <nz-option
                    *ngFor="let category of categories"
                    [nzLabel]="category.name"
                    [nzValue]="category.category_id"
                  ></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label class="required-marker">Unit</nz-form-label>
              <nz-form-control
                [nzErrorTip]="
                  form.get('unit_id')?.hasError('required')
                    ? 'Please enter product unit'
                    : ''
                "
              >
                <nz-select
                  id="unit_id"
                  nzShowSearch
                  nzAllowClear
                  nzPlaceHolder="Select Unit"
                  formControlName="unit_id"
                >
                  <nz-option
                    *ngFor="let unit of units"
                    [nzLabel]="unit.name"
                    [nzValue]="unit.unit_id"
                  ></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>
        <div nz-row nzGutter="16">
          <div nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label nzFor="stock_quantity" class="required-marker"
                >Stock</nz-form-label
              >
              <nz-form-control
                [nzErrorTip]="
                  form.get('stock_quantity')?.hasError('required')
                    ? 'Please enter stock quantity'
                    : ''
                "
              >
                <input
                  nz-input
                  placeholder="Enter stock quantity"
                  formControlName="stock_quantity"
                  type="number"
                  id="stock_quantity"
                />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label nzFor="price" class="required-marker"
                >Price</nz-form-label
              >
              <nz-form-control
                [nzErrorTip]="
                  form.get('price')?.hasError('required')
                    ? 'Please enter price'
                    : ''
                "
              >
                <input
                  nz-input
                  placeholder="Enter price"
                  formControlName="price"
                  type="number"
                  id="price"
                />
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>
        <nz-form-item>
          <nz-form-label nzFor="description">Description</nz-form-label>
          <nz-form-control
            [nzErrorTip]="
              form.get('description')?.hasError('required')
                ? 'Please enter description'
                : ''
            "
          >
            <textarea
              nz-input
              id="description"
              placeholder="Product description"
              [nzAutosize]="{ minRows: 3, maxRows: 3 }"
              formControlName="description"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control style="text-align: end;">
            <button
              nz-button
              nzType="default"
              type="button"
              style="margin-right: 10px;"
            >
              Cancel
            </button>
            <button
              nz-button
              nzType="primary"
              [disabled]="!form.valid || loading"
              (click)="onSubmit()"
            >
              <i *ngIf="loading" nz-icon nzType="loading"></i>
              Submit
            </button>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
  `,
  styles: [
    `
      .ant-btn-primary[disabled] {
        background-color: #1890ff;
        color: #ffffff;
        border: none;
        opacity: 0.65;
      }
      .ant-btn-primary[disabled]:hover {
        background-color: #1890ff;
      }
      .ant-btn-primary:hover {
        background-color: #096dd9;
        color: #ffffff;
        border-color: #096dd9;
      }
    `,
  ],
})
export class ProductOperationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoriesService,
    private unitService: UnitsService,
    private modalRef: NzModalRef<ProductOperationComponent>,
    private message: NzMessageService,
    private uiService: ProductUiService
  ) {}

  private modal = inject(NZ_MODAL_DATA) as Product;
  form!: FormGroup;
  product!: Product;
  categories: Category[] = [];
  units: Unit[] = [];
  loading: boolean = false;

  ngOnInit(): void {
    //Inject data
    this.product = this.modal;

    this.form = this.fb.group({
      name: [this.product?.name || '', [Validators.required]],
      price: [
        this.product?.price !== undefined ? this.product.price : '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      image: [this.product?.image || '', [Validators.required]],
      category_id: [
        this.product?.category ? this.product.category.category_id : null,
      ],
      unit_id: [this.product?.unit_id, [Validators.required]],
      stock_quantity: [
        this.product?.stock_quantity !== undefined
          ? this.product.stock_quantity
          : '',
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],
      description: [this.product?.description || ''],
    });

    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.unitService.getUnits().subscribe((unitData) => {
      this.units = unitData;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      const productData = { ...this.form.value };
      if (this.product) {
        this.productService
          .updateProduct(this.product.product_id, productData)
          .subscribe({
            next: () => {
              this.loading = false;
              this.modalRef.close(true);
              this.message.success('Product edited successfully!');
              this.uiService.refresher.emit();
            },
            error: (error) => {
              console.log(error);
              this.message.error('An error occurred while adding the product.');
              this.loading = false;
            },
            complete: () => {
              this.loading = false;
            },
          });
      } else {
        this.productService.addProduct(productData).subscribe({
          next: () => {
            this.loading = false;
            this.modalRef.close(true);
            this.message.success('Product added successfully.');
            this.uiService.refresher.emit();
          },
          error: (error: any) => {
            console.error(error);
            this.loading = false;
            this.message.error('An error occurred while adding the product.');
          },
          complete: () => {
            this.loading = false;
          },
        });
      }
    }
  }
}
