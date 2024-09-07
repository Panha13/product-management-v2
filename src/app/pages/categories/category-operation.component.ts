import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CategoriesService } from './categories.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomValidators } from 'src/app/helpers/customValidators';

@Component({
  selector: 'app-category-operation',
  template: `
    <div *nzModalTitle>
      <span *ngIf="id">{{ 'Edit Category' | translate }}</span>
      <span *ngIf="!id">{{ 'Add Category' | translate }}</span>
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
            'Category Name' | translate
          }}</nz-form-label>
          <nz-form-control nzHasFeedback>
            <input
              nz-input
              formControlName="name"
              [placeholder]="'Enter category name' | translate"
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
export class CategoryOperationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private raf: NzModalRef<CategoryOperationComponent>,
    private service: CategoriesService,
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
    const { required, nameExistValidator } = CustomValidators;
    this.frm = this.fb.group({
      name: [null, [required], [nameExistValidator(this.service, this.id)]],
      description: [null],
    });
  }

  private setFrmValue(): void {
    this.service.find(this.id).subscribe({
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
        this.notify.error('Error', 'Failed to load category details.');
      },
    });
  }

  onSubmit(): void {
    if (this.frm.valid) {
      this.loading = true;

      const categoryData = { ...this.frm.value };

      const categoryAction$ = this.id
        ? this.service.edit(this.id, categoryData)
        : this.service.add(categoryData);

      categoryAction$.subscribe({
        next: () => {
          this.handleSuccess(
            this.id
              ? 'Category updated successfully!'
              : 'Category added successfully.'
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
    this.msg.error('An error occurred while processing the category.');
  }

  onCancel(): void {
    this.raf.triggerCancel();
  }
}
