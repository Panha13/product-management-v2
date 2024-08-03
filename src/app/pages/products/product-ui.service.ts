import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Product } from './product';
import { ProductOperationComponent } from './product-operation.component';

@Injectable({
  providedIn: 'root',
})
export class ProductUiService {
  constructor(private modalService: NzModalService) {}

  refresher = new EventEmitter<void>();

  showAdd() {
    this.modalService.create({
      nzTitle: 'Add Product',
      nzContent: ProductOperationComponent,
      nzCentered: true,
      nzFooter: null,
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }

  showEdit(product: Product) {
    this.modalService.create({
      nzTitle: 'Edit Product ',
      nzContent: ProductOperationComponent,
      nzCentered: true,
      nzData: product,
      nzFooter: null,
      nzOnOk: () => {
        this.refresher.emit();
        console.log('hi');
      },
    });
  }
}
