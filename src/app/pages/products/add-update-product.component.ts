import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductInterface } from './product-interface';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-update-product',
  template: `
    <div nz-row nzJustify="center">
      <nz-spin [nzSpinning]="loading">
        <form
          class="form-container"
          nz-form
          [nzLayout]="'vertical'"
          [formGroup]="validateForm"
          (ngSubmit)="submitForm()"
        >
          <nz-form-item>
            <nz-form-label nzFor="title" class="required-marker"
              >Product Name</nz-form-label
            >
            <nz-form-control nzErrorTip="Please enter product name">
              <input
                nz-input
                placeholder="Enter product name"
                formControlName="title"
                type="text"
                id="title"
              />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label nzFor="image" class="required-marker"
              >Image Link</nz-form-label
            >
            <nz-form-control nzErrorTip="Please enter image link">
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
                <nz-form-label class="required-marker">Category</nz-form-label>
                <nz-form-control nzErrorTip="Please select category">
                  <nz-select
                    id="category"
                    nzShowSearch
                    nzAllowClear
                    nzPlaceHolder="Select category"
                    formControlName="category"
                  >
                    <nz-option
                      *ngFor="let category of categories"
                      [nzLabel]="category"
                      [nzValue]="category"
                    ></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label nzFor="price" class="required-marker"
                  >Price</nz-form-label
                >
                <nz-form-control nzErrorTip="Please enter price">
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
            <nz-form-control nzErrorTip="Please enter description">
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
                routerLink="/products"
                style="margin-right: 10px;"
              >
                Back
              </button>
              <button nz-button nzType="primary" type="submit">
                {{ isUpdateMode ? 'Update Product' : 'Add Product' }}
              </button>
            </nz-form-control>
          </nz-form-item>
        </form>
      </nz-spin>
    </div>
  `,
  styles: [
    `
      nz-form-label {
        font-weight: bold;
      }

      .form-container {
        width: 600px;
        background-color: #fff;
        padding: 40px 40px 16px 40px;
        border-radius: 15px;
      }
      .required-marker::after {
        display: inline-block;
        margin-left: 4px;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
      }
    `,
  ],
})
export class AddUpdateProductComponent implements OnInit {
  selectedValue = null;
  isUpdateMode: boolean = false;
  categories: string[] = [];
  productId?: number;
  loading = false;

  validateForm: FormGroup<{
    title: FormControl<string | null>;
    image: FormControl<string | null>;
    category: FormControl<string | null>;
    price: FormControl<number | null>;
    description: FormControl<string | null>;
  }> = this.fb.group({
    title: this.fb.control<string | null>(null, Validators.required),
    image: this.fb.control<string | null>(null, Validators.required),
    category: this.fb.control<string | null>(null, Validators.required),
    price: this.fb.control<number | null>(null, Validators.required),
    description: this.fb.control<string | null>(null, Validators.required),
  });

  constructor(
    private _productsService: ProductsService,
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isUpdateMode = true;
        this.productId = id;
        this.loading = true;
        this._productsService.getProductById(id).subscribe((product) => {
          this.validateForm.patchValue({
            title: product.title,
            image: product.image,
            category: product.category,
            price: product.price,
            description: product.description,
          });
          this.loading = false;
        });
      }
    });

    this._productsService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
      if (!this.isUpdateMode) {
        this.loading = false;
      }
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.loading = true;
      const productData: ProductInterface = {
        id: this.productId || 0,
        title: this.validateForm.value.title!,
        image: this.validateForm.value.image!,
        category: this.validateForm.value.category!,
        price: this.validateForm.value.price!,
        description: this.validateForm.value.description!,
        rating: { rate: 0, count: 0 },
      };

      if (this.isUpdateMode) {
        this._productsService.updateProduct(productData).subscribe({
          next: (res) => {
            this.messageService.success('Product updated successfully!');
            this.router.navigate(['/products']);
            this.loading = false;
          },
          error: (err) => {
            console.error('Error updating product:', err);
            this.messageService.error(
              'Failed to update product. Please try again.'
            );
            this.loading = false;
          },
        });
      } else {
        this._productsService.addProduct(productData).subscribe({
          next: (res) => {
            this.messageService.success('Product added successfully!');
            this.router.navigate(['/products']);
            this.loading = false;
          },
          error: (err) => {
            console.error('Error adding product:', err);
            this.messageService.error(
              'Failed to add product. Please try again.'
            );
            this.loading = false;
          },
        });
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
