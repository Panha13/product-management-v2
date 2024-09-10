import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from './product.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { CustomValidators } from 'src/app/helpers/customValidators';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-product-operation',
  template: `
    <div *nzModalTitle>
      <span *ngIf="productId">{{ 'Edit Product' | translate }}</span>
      <span *ngIf="!productId">{{ 'Add Product' | translate }}</span>
    </div>
    <div>
      <div *ngIf="loading_form" class="loading-overlay">
        <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
      </div>
      <form
        class="form-container"
        nz-form
        [nzLayout]="'vertical'"
        [formGroup]="form"
        [nzAutoTips]="autoTips"
      >
        <div nz-row nzGutter="16">
          <div nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label class="required-marker">{{
                'Product Name' | translate
              }}</nz-form-label>
              <nz-form-control>
                <input
                  nz-input
                  [placeholder]="'Enter product name' | translate"
                  formControlName="name"
                  type="text"
                />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label class="required-marker">{{
                'Price' | translate
              }}</nz-form-label>
              <nz-form-control>
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
                [nzAction]="API_UPLOAD_URL"
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
              <nz-form-control>
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
              <nz-form-control>
                <app-unit-select formControlName="unit_id"></app-unit-select>
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>
        <nz-form-item>
          <nz-form-label>{{ 'Category' | translate }}</nz-form-label>
          <nz-form-control>
            <app-category-select
              formControlName="category_id"
            ></app-category-select>
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
      <button nz-button nzType="default" (click)="onCancel()">
        {{ 'Cancel' | translate }}
      </button>
      <button
        nz-button
        nzType="primary"
        [disabled]="loading || !form.valid"
        (click)="onSubmit()"
        [nzLoading]="loading"
      >
        {{ 'Submit' | translate }}
      </button>
    </div>
  `,
  styles: [
    `
      .w-100 {
        width: 100%;
      }

      :host ::ng-deep .ant-upload.ant-upload-select-picture-card {
        width: 100%;
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
        width: 100%;
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
    private modalRef: NzModalRef<ProductOperationComponent>,
    private notify: NzNotificationService,
    private message: NzMessageService
  ) {}

  private readonly DEFAULT_IMG_URL =
    '../../assets/image/default-product-image.png';
  readonly API_UPLOAD_URL = 'http://localhost:3000/api/upload';
  readonly productId = inject(NZ_MODAL_DATA);

  fileProfile: NzUploadFile[] = [];
  form!: FormGroup;
  loading: boolean = false;
  loading_form: boolean = false;
  imageUrl: string = '';
  autoTips = CustomValidators.autoTips;

  ngOnInit(): void {
    this.initForm();

    if (this.productId) {
      this.loading_form = true;
      this.setFrmValue();
    }
  }

  private initForm(): void {
    const { required } = CustomValidators;
    this.form = this.fb.group({
      name: [null, [required]],
      price: [null, [required]],
      stock_quantity: [null, [required]],
      image: [null],
      category_id: [null],
      unit_id: [null, [required]],
      description: [null],
    });
  }

  private setFrmValue(): void {
    this.productService.find(this.productId).subscribe({
      next: (result) => {
        this.form.setValue({
          name: result.name,
          price: result.price,
          stock_quantity: result.stock_quantity,
          image: result.image || this.DEFAULT_IMG_URL,
          category_id: result.category?.category_id || null,
          unit_id: result.unit_id,
          description: result.description || null,
        });
        // Initialize image data
        this.fileProfile = [
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: result.image,
          },
        ];

        this.loading_form = false;
      },
      error: (err) => {
        console.log(err);
        this.loading_form = false;
        this.notify.error('Error', 'Failed to load product details.', {
          nzDuration: 2500,
        });
      },
    });
  }

  beforeUpload = (
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> => {
    return new Observable((observer: Observer<boolean>) => {
      const isImage = file.type?.startsWith('image/');

      if (!isImage) {
        this.message.error('You can only upload image files!');
        observer.complete();
        return;
      }

      observer.next(isImage);
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

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;

      const productData = { ...this.form.value };

      if (!productData.image) {
        productData.image = this.DEFAULT_IMG_URL;
      }

      const productAction$ = this.productId
        ? this.productService.edit(this.productId, productData)
        : this.productService.add(productData);

      productAction$.subscribe({
        next: () => {
          this.handleSuccess(
            this.productId
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
