import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { UnitsService } from './units.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomValidators } from 'src/app/helpers/customValidators';

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
          <nz-form-control>
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
export class UnitOperationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private raf: NzModalRef<UnitOperationComponent>,
    private service: UnitsService,
    private notify: NzNotificationService,
    private msg: NzMessageService
  ) {}

  readonly id = inject(NZ_MODAL_DATA);

  loading: boolean = false;
  loading_form: boolean = false;
  frm!: FormGroup;
  autoTips = CustomValidators.autoTips;

  ngOnInit() {
    this.initFrm();
    if (this.id) {
      this.loading_form = true;
      if (this.id) {
        this.loading_form = true;
        this.setFrmValue();
      }
    }
  }

  private initFrm(): void {
    const { required } = CustomValidators;
    this.frm = this.fb.group({
      name: [null, [required]],
      description: [null],
    });
  }

  private setFrmValue(): void {
    this.service.getUnit(this.id).subscribe({
      next: (result) => {
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

  onSubmit(): void {
    if (this.frm.valid) {
      this.loading = true;

      const unitData = { ...this.frm.value };

      const unitAction$ = this.id
        ? this.service.updateUnit(this.id, unitData)
        : this.service.addUnit(unitData);

      unitAction$.subscribe({
        next: () => {
          this.handleSuccess(
            this.id ? 'Unit updated successfully!' : 'Unit added successfully.'
          );
        },
        error: (error) => {
          this.handleError(error);
        },
      });
    }
  }

  private handleSuccess(successMessage: string): void {
    this.loading = false;
    this.raf.triggerOk();
    this.msg.success(successMessage);
  }

  private handleError(error: any): void {
    console.error(error);
    this.loading = false;
    this.msg.error('An error occurred while processing the unit.');
  }

  onCancel(): void {
    this.raf.triggerCancel();
  }
}
