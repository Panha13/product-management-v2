import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ProductService } from './product.service';
import { Product } from './product';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-product-delete',
  template: `
    <div *nzModalTitle>
      <span>{{ 'Delete' | translate }} {{ model.code }}</span>
    </div>
    <div>
      <div *ngIf="loading_form" class="loading-overlay">
        <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
      </div>
      <form
        class="form-container"
        nz-form
        [nzLayout]="'vertical'"
        [formGroup]="frm"
      >
        <nz-form-item>
          <nz-form-label class="required-marker">{{
            'Product Name' | translate
          }}</nz-form-label>
          <nz-form-control>
            <input nz-input formControlName="name" type="text" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>{{ 'Note' | translate }}</nz-form-label>
          <nz-form-control>
            <textarea
              nz-input
              [placeholder]="'Enter note' | translate"
              [nzAutosize]="{ minRows: 3, maxRows: 3 }"
              formControlName="note"
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
        nzDanger
        nzType="primary"
        [disabled]="loading"
        (click)="onDelete()"
        [nzLoading]="loading"
      >
        {{ 'Delete' | translate }}
      </button>
    </div>
  `,
  styles: [],
})
export class ProductDeleteComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private raf: NzModalRef<ProductDeleteComponent>,
    private service: ProductService,
    private msg: NzMessageService
  ) {}

  private id = inject(NZ_MODAL_DATA);

  loading: boolean = false;
  loading_form: boolean = false;
  frm!: FormGroup;
  model: Product = {};

  ngOnInit() {
    if (this.id) {
      this.initFrm();
      this.loading_form = true;
      this.service.getProduct(this.id).subscribe({
        next: (result) => {
          this.model = result;
          this.frm.setValue({
            name: this.model.name,
            note: '',
          });
          this.loading_form = false;
        },
        error: (err) => {
          console.error(err);
          this.loading_form = false;
          this.msg.error('Product not found. It might have been deleted.');
        },
      });
    }
  }

  private initFrm(): void {
    this.frm = this.fb.group({
      name: [{ value: null, disabled: true }],
      note: [null],
    });
  }

  onDelete(): void {
    this.loading = true;
    this.service.deleteProduct(this.id, this.frm.value.note).subscribe({
      next: () => {
        this.loading = false;
        this.raf.triggerOk();
        this.msg.success('Product deleted successfull');
      },
      error: (err) => {
        this.loading = false;
        this.msg.error('Product deleted failed!');
        console.error('Deletion failed', err);
      },
    });
  }

  onCancel(): void {
    this.raf.triggerCancel();
  }
}
