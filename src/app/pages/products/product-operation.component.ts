import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from './product';
import { ProductService } from './product.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/category';
import { Unit, UnitsService } from '../units/units.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductUiService } from './product-ui.service';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-product-operation',
  template: `
    <div *nzModalTitle>
      <span *ngIf="modal">{{ 'Edit Product' | translate }}</span>
      <span *ngIf="!modal">{{ 'Add Product' | translate }}</span>
    </div>
    <div nz-row nzJustify="center">
      <div *ngIf="loading_form" class="loading-overlay">
        <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
      </div>
      <form
        class="form-container"
        nz-form
        [nzLayout]="'vertical'"
        [formGroup]="form"
      >
        <div nz-row nzGutter="16">
          <div nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label class="required-marker">{{
                'Product Name' | translate
              }}</nz-form-label>
              <nz-form-control
                [nzErrorTip]="
                  form.get('name')?.hasError('required')
                    ? ('Please enter product name' | translate)
                    : ''
                "
              >
                <input
                  nz-input
                  [placeholder]="'Enter product name' | translate"
                  formControlName="name"
                  type="text"
                  autocomplete="true"
                />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label class="required-marker">{{
                'Price' | translate
              }}</nz-form-label>
              <nz-form-control
                [nzErrorTip]="
                  form.get('price')?.hasError('required')
                    ? ('Please enter price' | translate)
                    : ''
                "
              >
                <nz-input-number
                  [nzMin]="0"
                  [nzStep]="0.1"
                  formControlName="price"
                  [nzPlaceHolder]="'Enter product price' | translate"
                  class="w-100"
                ></nz-input-number>
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-upload
                [nzAction]="uploadUrl"
                [(nzFileList)]="fileProfile"
                [nzBeforeUpload]="beforeUpload"
                (nzChange)="handleImageUpload($event)"
                nzListType="picture-card"
                [nzShowButton]="fileProfile.length < 1"
              >
                <div>
                  <i nz-icon nzType="plus"></i>
                </div>
              </nz-upload>
            </nz-form-item>
          </div>
        </div>

        <div nz-row nzGutter="16">
          <div nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label class="required-marker">{{
                'Stock' | translate
              }}</nz-form-label>
              <nz-form-control
                [nzErrorTip]="
                  form.get('stock_quantity')?.hasError('required')
                    ? ('Please enter stock quantity' | translate)
                    : ''
                "
              >
                <nz-input-number
                  [nzMin]="0"
                  [nzStep]="1"
                  [nzPrecision]="0"
                  formControlName="stock_quantity"
                  [nzPlaceHolder]="'Please enter quantity' | translate"
                  class="w-100"
                ></nz-input-number>
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label class="required-marker">{{
                'Unit' | translate
              }}</nz-form-label>
              <nz-form-control
                [nzErrorTip]="
                  form.get('unit_id')?.hasError('required')
                    ? ('Please select product unit' | translate)
                    : ''
                "
              >
                <nz-select
                  nzShowSearch
                  nzAllowClear
                  [nzPlaceHolder]="'Select Unit' | translate"
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
        <nz-form-item>
          <nz-form-label>{{ 'Category' | translate }}</nz-form-label>
          <nz-form-control>
            <nz-select
              nzShowSearch
              nzAllowClear
              [nzPlaceHolder]="'Select category' | translate"
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
        <nz-form-item>
          <nz-form-label>{{ 'Description' | translate }}</nz-form-label>
          <nz-form-control>
            <textarea
              nz-input
              [placeholder]="'Product description' | translate"
              [nzAutosize]="{ minRows: 3, maxRows: 3 }"
              formControlName="description"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
      <button
        nz-button
        nzType="primary"
        [disabled]="loading || !form.valid"
        (click)="onSubmit()"
        [nzLoading]="loading"
      >
        Submit
      </button>
    </div>
  `,
  styles: [
    `
      .w-100 {
        width: 100%;
      }

      :host ::ng-deep .ant-upload.ant-upload-select-picture-card {
        width: 210px;
        height: 140px;
        margin: 0;
        text-align: center;
        vertical-align: top;
        background-color: #fafafa;
        border: 1px dashed #d9d9d9;
        border-radius: 2px;
        cursor: pointer;
        transition: border-color 0.3s;
      }
      :host ::ng-deep .ant-upload-list-picture-card-container {
        width: 210px;
        height: 140px;
        margin: 0;
      }
      :host ::ng-deep .ant-upload-list-item-thumbnail img {
        object-fit: cover;
      }

      .form-container {
        position: relative;
      }

      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.8);
        z-index: 1000;
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
    private message: NzMessageService
  ) {}

  readonly modal = inject(NZ_MODAL_DATA) as Product;
  uploadUrl = 'http://localhost:3000/api/upload';
  fileProfile: NzUploadFile[] = [];
  form!: FormGroup;
  product: Product = {};
  categories: Category[] = [];
  units: Unit[] = [];
  loading: boolean = false;
  loading_form: boolean = false;
  imageUrl: string = '';

  ngOnInit(): void {
    this.product = this.modal;
    this.initForm();
    this.loadCate();
    this.loadUnits();

    if (this.product) {
      this.loading_form = true;
      this.setFrmValue(this.product.product_id!);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      stock_quantity: [null, [Validators.required]],
      image: [null, [Validators.required]],
      category_id: [null],
      unit_id: [null, [Validators.required]],
      description: [null],
    });
  }

  private setFrmValue(product_id: number): void {
    this.productService.getProduct(product_id).subscribe({
      next: (product) => {
        this.form.patchValue(product);
        this.initImg();
        this.loading_form = false;
      },
      error: (err) => {
        console.log(err);
        this.message.error('Failed to load product details.');
      },
    });
  }

  private initImg(): void {
    this.imageUrl = this.product?.image || '';

    if (this.imageUrl) {
      this.fileProfile = [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: this.imageUrl,
        },
      ];
    }
  }

  beforeUpload = (
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';

      if (!isJpgOrPng) {
        this.message.error('You can only upload JPG file !');
        observer.complete();
        return;
      }

      observer.next(isJpgOrPng);
      observer.complete();
    });
  };

  handleImageUpload(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      if (info.file.response && info.file.response.imageUrl) {
        this.imageUrl = info.file.response.imageUrl;
        this.form.patchValue({ image: this.imageUrl });
      } else {
        this.message.error('Image upload failed.');
      }
    } else if (info.file.status === 'removed') {
      this.imageUrl = '';
      this.form.patchValue({ image: '' });
    } else if (info.file.status === 'error') {
      console.error('Upload error:', info.file.error);
      this.message.error('Image upload failed.');
    }
  }

  private loadCate(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (error) => {
        console.error('Failed to load categories:', error);
        this.message.error('An error occured while loading categories.');
      },
    });
  }

  private loadUnits(): void {
    this.unitService.getUnits().subscribe({
      next: (unitData) => (this.units = unitData),
      error: (error) => {
        console.error('Failed to load units:', error);
        this.message.error('An error occurred while loading units.');
      },
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;

      const productData = { ...this.form.value };

      const productAction$ = this.product
        ? this.productService.updateProduct(
            this.product.product_id!,
            productData
          )
        : this.productService.addProduct(productData);

      productAction$.subscribe({
        next: () => {
          this.handleSuccess(
            this.product
              ? 'Product edited successfully!'
              : 'Product added successfully.'
          );
        },
        error: (error) => {
          this.handleError(error);
        },
      });
    }
  }

  onCancel(): void {
    this.modalRef.close(true);
  }

  private handleSuccess(successMessage: string): void {
    this.loading = false;
    this.modalRef.triggerOk();
    this.message.success(successMessage);
  }

  private handleError(error: any): void {
    console.error(error);
    this.loading = false;
    this.message.error('An error occurred while processing the product.');
  }
}
