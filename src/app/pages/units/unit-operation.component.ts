import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Unit, UnitsService } from './units.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomValidators } from 'src/app/helpers/customValidators';
import { BaseOperationComponent } from 'src/app/utils/components/base-operation.component';

@Component({
  selector: 'app-unit-operation',
  template: `
    <div *nzModalTitle>
      <span *ngIf="id">{{ 'Edit Unit' | translate }}</span>
      <span *ngIf="!id">{{ 'Add Unit' | translate }}</span>
    </div>
    <div>
      <div *ngIf="loading_form" class="loading-overlay">
        <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
      </div>
      <form
        class="form-container"
        nz-form
        [nzLayout]="'vertical'"
        [nzAutoTips]="autoTips"
        [formGroup]="frm"
      >
        <nz-form-item>
          <nz-form-label class="required-marker">{{
            'Unit Name' | translate
          }}</nz-form-label>
          <nz-form-control nzHasFeedback>
            <input
              nz-input
              formControlName="name"
              [placeholder]="'Enter unit name' | translate"
              type="text"
            />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>{{ 'Description' | translate }}</nz-form-label>
          <nz-form-control>
            <textarea
              nz-input
              [placeholder]="'Enter description' | translate"
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
        [disabled]="loading || !frm.valid"
        (click)="onSubmit()"
        [nzLoading]="loading"
      >
        {{ 'Submit' | translate }}
      </button>
    </div>
  `,
  styles: [],
})
export class UnitOperationComponent extends BaseOperationComponent<Unit> {
  constructor(
    fb: FormBuilder,
    modalRef: NzModalRef<any>,
    service: UnitsService,
    notify: NzNotificationService,
    msg: NzMessageService
  ) {
    super(fb, modalRef, service, notify, msg);
  }

  override initControl(): void {
    const { required, nameExistValidator } = CustomValidators;
    this.frm = this.fb.group({
      name: [null, [required], [nameExistValidator(this.service, this.id)]],
      description: [null],
    });
  }

  override setFrmValue(): void {
    this.service.find(this.id).subscribe({
      next: (result: Unit) => {
        this.frm.setValue({
          name: result.name,
          description: result.description || null,
        });

        this.loading_form = false;
      },
      error: (err) => {
        console.log(err);
        this.loading_form = false;
        this.notify.error('Error', 'Failed to load unit details.');
      },
    });
  }
}
