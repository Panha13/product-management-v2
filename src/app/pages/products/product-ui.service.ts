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
      nzData: id,
      nzClassName: 'custom-modal',
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
    console.log(id);
  }

  showDelete(product: Product): void {
    this.modalService.create({
      nzWidth: '450px',
      nzContent: ProductDeleteComponent,
      nzData: product,
      nzClassName: 'modal-delete',
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
    console.log(product);
  }

  // showDelete(product: Product): void {
  //   this.modalService.confirm({
  //     nzTitle: 'Are you sure you want to delete this product?',
  //     nzContent: `Product Name: ${product.name}`,
  //     nzOkText: 'Yes',
  //     nzOkDanger: true,
  //     nzCancelText: 'No',
  //     nzOnOk: () =>
  //       new Promise((resolve, reject) => {
  //         this.productService.deleteProduct(product.product_id!).subscribe({
  //           next: () => {
  //             this.message.success('Product deleted successfully.');
  //             this.refresher.emit();
  //             resolve();
  //           },
  //           error: (err) => {
  //             console.log(err);
  //             this.message.error('Failed to delete product.');
  //             reject(err);
  //           },
  //         });
  //       }),
  //   });
  // }
}
