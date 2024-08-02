import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Product } from './product';
import { ProductOperationComponent } from './product-operation.component';

@Injectable({
  providedIn: 'root',
})
export class ProductUiService {
  constructor(private modalService: NzModalService) {}

  openProductModal(product?: Product): Promise<boolean> {
    return new Promise((resolve) => {
      const modal = this.modalService.create({
        nzTitle: product ? 'Edit Product' : 'Add Product',
        nzContent: ProductOperationComponent,
        nzCentered: true,
        nzData: { product: product },
        nzFooter: null,
        nzOnOk: () => resolve(true),
        nzOnCancel: () => resolve(false),
      });

      modal.afterClose.subscribe((result: boolean) => {
        resolve(result);
      });
    });
  }

  confirmDelete(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const modal = this.modalService.confirm({
        nzTitle: 'Confirm Deletion',
        nzContent: `<p>${message}</p>`,
        nzOkText: 'Yes',
        nzOkType: 'primary',

        nzOkDanger: true,
        nzOnOk: () => resolve(true),
        nzOnCancel: () => resolve(false),
      });
    });
  }
}
