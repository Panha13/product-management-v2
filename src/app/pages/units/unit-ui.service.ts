import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UnitOperationComponent } from './unit-operation.component';
import { UnitDeleteComponent } from './unit-delete.component';

@Injectable({
  providedIn: 'root',
})
export class UnitUiService {
  constructor(private modalService: NzModalService) {}

  refresher = new EventEmitter<void>();

  showAdd() {
    this.modalService.create({
      nzWidth: '540px',
      nzContent: UnitOperationComponent,
      nzMaskClosable: false,
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }

  showEdit(id: number) {
    this.modalService.create({
      nzWidth: '540px',
      nzContent: UnitOperationComponent,
      nzMaskClosable: false,
      nzData: id,
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }

  showDelete(id: number): void {
    this.modalService.create({
      nzWidth: '450px',
      nzContent: UnitDeleteComponent,
      nzData: id,
      nzMaskClosable: false,
      nzClassName: 'modal-delete',
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }
}
