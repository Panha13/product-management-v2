import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from './product';
import { ProductService } from './product.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/category';

@Component({
  selector: 'app-product-operation',
  template: `
    <div nz-row nzJustify="center">
      <form
        class="form-container"
        nz-form
        [nzLayout]="'vertical'"
        [formGroup]="form"
        (ngSubmit)="submitForm()"
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
        <nz-form-item>
          <nz-form-label class="required-marker">Category</nz-form-label>
          <nz-form-control>
            <nz-select
              id="category"
              nzShowSearch
              nzAllowClear
              nzPlaceHolder="Select category"
              formControlName="category"
            >
              <nz-option
                *ngFor="let category of categories"
                [nzLabel]="category.name"
                [nzValue]="category.category_id"
              ></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
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
          <nz-form-label nzFor="description" class="required-marker"
            >Description</nz-form-label
          >
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
              (click)="cancel()"
            >
              Cancel
            </button>
            <button nz-button nzType="primary" type="submit">Submit</button>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
  `,
  styles: [],
})
export class ProductOperationComponent implements OnInit {
  form!: FormGroup;
  product: Product | null = null;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoriesService,
    private modalRef: NzModalRef<ProductOperationComponent>,
    @Inject(NZ_MODAL_DATA) private data: { product: Product | null }
  ) {
    this.product = data.product;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.product?.product_name || '', [Validators.required]],
      price: [
        this.product?.price !== undefined ? this.product.price : '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      image: [this.product?.image || '', [Validators.required]],
      category: [this.product?.category.category_id || null],
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
  }

  submitForm(): void {
    if (this.form.valid) {
      const productData = this.form.value;
      if (this.product) {
        this.productService
          .updateProduct(this.product.product_id, productData)
          .subscribe(() => {
            this.modalRef.close(true);
          });
      } else {
        this.productService.addProduct(productData).subscribe(() => {
          this.modalRef.close(true);
        });
      }
    } else {
      for (const i in this.form.controls) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    console.log(this.form.value);
  }

  cancel(): void {
    this.modalRef.close(false);
    this.form.reset();
  }
}
