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
  templateUrl: './product-operation.component.html',
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
