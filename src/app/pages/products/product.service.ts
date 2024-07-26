import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this._apiUrl)
      .pipe(
        map((products) => products.sort((a, b) => b.product_id - a.product_id))
      );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this._apiUrl}/${id}`);
  }

  // getCategories():Observable

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this._apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this._apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this._apiUrl}/${id}`);
  }
}
