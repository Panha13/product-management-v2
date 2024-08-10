import { Component, OnInit, inject } from '@angular/core';
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
    <div nz-row nzJustify="center">
      <form
        class="form-container"
        nz-form
        [nzLayout]="'vertical'"
        [formGroup]="form"
      >
        <div nz-row nzGutter="16">
          <div nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label class="required-marker"
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
                  autocomplete="true"
                />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label class="required-marker">Price</nz-form-label>
              <nz-form-control
                [nzErrorTip]="
                  form.get('price')?.hasError('required')
                    ? 'Please enter price'
                    : ''
                "
              >
                <nz-input-number
                  [nzMin]="0"
                  [nzStep]="0.1"
                  formControlName="price"
                  [nzPlaceHolder]="'Please enter price'"
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
              <nz-form-label class="required-marker">Stock</nz-form-label>
              <nz-form-control
                [nzErrorTip]="
                  form.get('stock_quantity')?.hasError('required')
                    ? 'Please enter stock quantity'
                    : ''
                "
              >
                <nz-input-number
                  [nzMin]="0"
                  [nzStep]="1"
                  [nzPrecision]="0"
                  formControlName="stock_quantity"
                  [nzPlaceHolder]="'Please enter quantity'"
                  class="w-100"
                ></nz-input-number>
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
        <nz-form-item>
          <nz-form-label>Category</nz-form-label>
          <nz-form-control>
            <nz-select
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
        <nz-form-item>
          <nz-form-label>Description</nz-form-label>
          <nz-form-control
            [nzErrorTip]="
              form.get('description')?.hasError('required')
                ? 'Please enter description'
                : ''
            "
          >
            <textarea
              nz-input
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
              (click)="onCancel()"
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
  uploadUrl = 'http://localhost:3000/api/upload';
  fileProfile: NzUploadFile[] = [];
  form!: FormGroup;
  product!: Product;
  categories: Category[] = [];
  units: Unit[] = [];
  loading: boolean = false;
  imageUrl: string = '';

  ngOnInit(): void {
    //Inject data
    this.product = this.modal;

    this.initForm();
    this.loadCate();
    this.loadUnits();
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

  private initForm(): void {
    this.imageUrl = this.product?.image || '';
    this.form = this.fb.group({
      name: [this.product?.name || '', [Validators.required]],
      price: [
        this.product?.price !== undefined ? this.product.price : '',
        [Validators.required],
      ],
      stock_quantity: [
        this.product?.stock_quantity !== undefined
          ? this.product.stock_quantity
          : '',
        [Validators.required],
      ],
      image: [this.product?.image || '', [Validators.required]],
      category_id: [
        this.product?.category ? this.product.category.category_id : null,
      ],
      unit_id: [this.product?.unit_id, [Validators.required]],
      description: [this.product?.description || ''],
    });

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
            this.product.product_id,
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
    this.modalRef.close(true);
    this.message.success(successMessage);
    this.uiService.refresher.emit();
  }

  private handleError(error: any): void {
    console.error(error);
    this.loading = false;
    this.message.error('An error occurred while processing the product.');
  }
}
