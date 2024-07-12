import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ProductInterface } from './product-interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private _apiUrl = 'https://fakestoreapi.com/products';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // getProducts() {
  //   return this.http.get(this._apiUrl);
  // }
  getProducts(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(this._apiUrl);
  }

  getProductById(id: number): Observable<ProductInterface> {
    return this.http
      .get<ProductInterface>(this._apiUrl + '/' + id)
      .pipe(catchError(this.errorHandler));
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(this._apiUrl + '/categories');
  }
  addProduct(product: ProductInterface): Observable<ProductInterface> {
    return this.http
      .post<ProductInterface>(
        this._apiUrl,
        JSON.stringify(product),
        this.httpOptions
      )
      .pipe(
        tap((data) => console.log(data)),
        catchError(this.errorHandler)
      );
  }

  updateProduct(product: ProductInterface): Observable<ProductInterface> {
    return this.http
      .put<ProductInterface>(
        `${this._apiUrl}/${product.id}`,
        JSON.stringify(product),
        this.httpOptions
      )
      .pipe(
        tap((data) => console.log(data)),
        catchError(this.errorHandler)
      );
  }

  deleteProduct(id: number): Observable<ProductInterface> {
    return this.http
      .delete<ProductInterface>(this._apiUrl + '/' + id)
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
