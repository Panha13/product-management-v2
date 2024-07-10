import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductInterface } from './product-interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private _apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  // getProducts() {
  //   return this.http.get(this._apiUrl);
  // }
  getProducts(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(this._apiUrl);
  }
}
