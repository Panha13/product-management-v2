import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from './product';
import { ProductService } from './product.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-product-operation',
  template: `
    <form [formGroup]="form" (ngSubmit)="submitForm()">
      <label for="name">Product Name:</label>
      <input id="name" formControlName="name" /><br />

      <label for="price">Price:</label>
      <input id="price" formControlName="price" /><br />

      <label for="stock_quantity">Quantity</label>
      <input id="stock_quantity" formControlName="stock_quantity" /><br />

      <label for="image">Image link</label>
      <input id="image" formControlName="image" /><br />

      <label for="category">Category</label>
      <input id="category" formControlName="category" /><br />

      <label for="description">Description</label>
      <input id="description" formControlName="description" /><br />
      <button nz-button nzType="primary" type="submit">Submit</button>
    </form>
  `,
  styles: [],
})
export class ProductOperationComponent implements OnInit {
  form!: FormGroup;
  product: Product | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private modalRef: NzModalRef<ProductOperationComponent>,
    @Inject(NZ_MODAL_DATA) private data: { product: Product | null }
  ) {
    this.product = data.product;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.product?.product_name || '', [Validators.required]],
      price: [this.product?.price || '', [Validators.required]],
      image: [this.product?.image || '', [Validators.required]],
      category: [this.product?.category || '', [Validators.required]],
      stock_quantity: [
        this.product?.stock_quantity || '',
        [Validators.required],
      ],
      description: [this.product?.description || '', [Validators.required]],
    });
    this.setFormValue();
  }

  setFormValue() {
    if (this.product) {
      this.form.patchValue({
        name: this.product.product_name || '',
        price: this.product.price || '',
        image: this.product.image || '',
        category: this.product.category || '',
        stock_quantity: this.product.stock_quantity || '',
        description: this.product.description || '',
      });
    }
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
    }
  }
}
