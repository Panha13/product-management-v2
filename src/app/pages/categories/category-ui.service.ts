import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CategoryOperationComponent } from './category-operation.component';
import { CategoryDeleteComponent } from './category-delete.component';

@Injectable({
  providedIn: 'root',
})
export class CategoryUiService {
  constructor(private modalService: NzModalService) {}

  refresher = new EventEmitter<void>();

  showAdd() {
    this.modalService.create({
      nzWidth: '540px',
      nzContent: CategoryOperationComponent,
      nzMaskClosable: false,
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }

  showEdit(id: number) {
    this.modalService.create({
      nzWidth: '540px',
      nzContent: CategoryOperationComponent,
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
      nzContent: CategoryDeleteComponent,
      nzData: id,
      nzMaskClosable: false,
      nzClassName: 'modal-delete',
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }
}
