import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Product } from './product';
import { ProductOperationComponent } from './product-operation.component';
import { ProductService } from './product.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductDeleteComponent } from './product-delete.component';

@Injectable({
  providedIn: 'root',
})
export class ProductUiService {
  constructor(
    private modalService: NzModalService,
    private productService: ProductService,
    private message: NzMessageService
  ) {}

  refresher = new EventEmitter<void>();

  showAdd() {
    this.modalService.create({
      nzWidth: '540px',
      nzContent: ProductOperationComponent,
      nzCentered: true,
      nzMaskClosable: false,
      nzClassName: 'custom-modal',
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
      nzClassName: 'custom-modal',
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
    console.log(id);
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
