import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Product } from './product';

@Component({
  selector: 'app-product-delete',
  template: `
    <div *nzModalTitle>
      <span>{{ 'Delete' | translate }}</span>
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
    private raf: NzModalRef<ProductDeleteComponent>
  ) {}

  loading: boolean = false;
  loading_form: boolean = false;
  frm!: FormGroup;

  ngOnInit() {
    this.initFrm();
  }

  private initFrm(): void {
    this.frm = this.fb.group({
      name: [{ value: null, disabled: true }],
      note: [null],
    });
  }

  onDelete(): void {}

  onCancel(): void {
    this.raf.triggerCancel();
  }
}
