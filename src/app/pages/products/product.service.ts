import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/helpers/base-api.service';

export interface Product {
  product_id?: number;
  code?: string;
  image?: string;
  name?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  unit_id?: number;
  category?: {
    category_id?: number;
    name?: string;
    description?: string;
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
