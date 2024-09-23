import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/helpers/base-api.service';

export interface Product {
  id?: number;
  code?: string;
  image?: string;
  name?: string;
  description?: string;
  price?: number;
  stockQty?: number;
  unitId?: number;
  category?: {
    id?: number;
    name?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseApiService<Product> {
  constructor(protected override http: HttpClient) {
    super(http, 'products');
  }
}
