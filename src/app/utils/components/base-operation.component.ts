import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseApiService } from 'src/app/helpers/base-api.service';
import { CustomValidators } from 'src/app/helpers/customValidators';

@Component({
  selector: 'app-base-operation',
  template: ``,
})
export class BaseOperationComponent<T> implements OnInit {
  constructor(
    protected fb: FormBuilder,
    protected modalRef: NzModalRef<any>,
    protected service: BaseApiService<any>,
    protected notify: NzNotificationService,
    protected msg: NzMessageService
  ) {}

  readonly id = inject(NZ_MODAL_DATA);

  loading: boolean = false;
  loading_form: boolean = false;
  frm!: FormGroup;
  autoTips = CustomValidators.autoTips;

  ngOnInit() {
    this.initControl();
    if (this.id) {
      this.loading_form = true;
      if (this.id) {
        this.loading_form = true;
        this.setFrmValue();
      }
    }
  }

  onSubmit(): void {
    if (this.frm.valid) {
      this.loading = true;

      const data = { ...this.frm.value };

      const operation$ = this.id
        ? this.service.edit(this.id, data)
        : this.service.add(data);

      operation$.subscribe({
        next: () => {
          this.handleSuccess(
            this.id ? 'Updated successfully.' : 'Added successfully.'
          );
        },
        error: (err) => {
          this.handleError(err);
        },
      });
    }
  }

  initControl(): void {}
  setFrmValue(): void {}

  private handleSuccess(successMessage: string): void {
    this.loading = false;
    this.modalRef.triggerOk();
    this.msg.success(successMessage);
  }

  private handleError(error: any): void {
    console.error(error);
    this.loading = false;
    this.msg.error('An error occurred while processing the unit.');
  }

  onCancel(): void {
    this.modalRef.triggerCancel();
  }
}