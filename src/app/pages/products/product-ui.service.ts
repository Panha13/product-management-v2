import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Product } from './product';
import { ProductOperationComponent } from './product-operation.component';
import { ProductService } from './product.service';
import { NzMessageService } from 'ng-zorro-antd/message';

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
      nzFooter: null,
      nzClassName: 'custom-modal',
    });
  }

  showEdit(product: Product) {
    this.modalService.create({
      nzWidth: '540px',
      nzContent: ProductOperationComponent,
      nzCentered: true,
      nzData: product,
      nzFooter: null,
      nzClassName: 'custom-modal',
    });
  }

  showDelete(product: Product): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this product?',
      nzContent: `Product Name: ${product.name}`,
      nzOkText: 'Yes',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.productService.deleteProduct(product.product_id).subscribe({
            next: () => {
              this.message.success('Product deleted successfully.');
              this.refresher.emit();
              resolve();
            },
            error: (err) => {
              console.log(err);
              this.message.error('Failed to delete product.');
              reject(err);
            },
          });
        }),
    });
  }
}
