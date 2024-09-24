import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseApiService } from 'src/app/helpers/base-api.service';

export interface sharedDomain {
  id?: number;
  name?: string;
}

@Component({
  selector: 'app-base-delete',
  template: ``,
})
export class BaseDeleteComponent<T extends sharedDomain> implements OnInit {
  constructor(protected service: BaseApiService<any>) {}

  protected fb = inject(FormBuilder);
  protected raf = inject(NzModalRef<any>);
  protected notify = inject(NzNotificationService);
  protected msg = inject(NzMessageService);

  readonly id = inject(NZ_MODAL_DATA);

  loading: boolean = false;
  loading_form: boolean = false;
  frm!: FormGroup;
  model: T | null = null;

  ngOnInit() {
    this.initControl();
    if (this.id) {
      this.loading_form = true;
      this.setFrmValue();
    }
  }

  onDelete(): void {
    this.loading = true;
    this.service.delete(this.id, this.frm.value.note).subscribe({
      next: () => {
        this.loading = false;
        this.raf.triggerOk();
        this.msg.success('Deleted successfull');
      },
      error: (err) => {
        this.loading = false;
        this.msg.error('Deleted failed');
        console.error(err);
      },
    });
  }
  onCancel(): void {
    this.raf.triggerCancel();
  }

  initControl(): void {
    this.frm = this.fb.group({
      name: [{ value: null, disabled: true }],
      note: [null],
    });
  }
  setFrmValue(): void {
    this.service.find(this.id).subscribe({
      next: (result) => {
        this.model = result;
        this.frm.setValue({
          name: this.model?.name,
          note: '',
        });
        this.loading_form = false;
      },
      error: (err) => {
        console.error(err);
        this.loading_form = false;
        this.notify.error('Record not found', 'It might have been deleted.');
      },
    });
  }
}
