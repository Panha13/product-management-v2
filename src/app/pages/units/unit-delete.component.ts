import { Component, OnInit } from '@angular/core';
import { Unit, UnitsService } from './units.service';
import { BaseDeleteComponent } from 'src/app/utils/components/base-delete.component';

@Component({
  selector: 'app-unit-delete',
  template: `
    <div *nzModalTitle>
      <span
        >{{ 'Delete' | translate }}
        {{ model?.name || ('Loading' | translate) }}</span
      >
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
            'Unit Name' | translate
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
export class UnitDeleteComponent
  extends BaseDeleteComponent<Unit>
  implements OnInit
{
  constructor(service: UnitsService) {
    super(service);
  }
}
