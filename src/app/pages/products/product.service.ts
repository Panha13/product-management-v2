import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(
    pageIndex: number,
    pageSize: number,
    searchQuery: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('searchQuery', searchQuery);

    return this.http.get<any>(this._apiUrl, { params });
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
