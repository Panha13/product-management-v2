import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProductOperationComponent } from './product-operation.component';
import { ProductDeleteComponent } from './product-delete.component';

@Injectable({
  providedIn: 'root',
})
export class ProductUiService {
  constructor(private modalService: NzModalService) {}

  refresher = new EventEmitter<void>();

  showAdd() {
    this.modalService.create({
      nzWidth: '540px',
      nzContent: ProductOperationComponent,
      nzCentered: true,
      nzMaskClosable: false,
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }

  showEdit(id: number) {
    this.modalService.create({
      nzWidth: '540px',
      nzContent: ProductOperationComponent,
      nzCentered: true,
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
      nzContent: ProductDeleteComponent,
      nzData: id,
      nzMaskClosable: false,
      nzClassName: 'modal-delete',
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }
}
