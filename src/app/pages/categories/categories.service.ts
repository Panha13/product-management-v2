import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductInterface } from '../products/product-interface';
import { Category } from './categories';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private _apiUrl = 'https://fakestoreapi.com/products';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(this._apiUrl);
  }

  getCategoriesWithCount(): Observable<Category[]> {
    return this.getProducts().pipe(
      map((products: ProductInterface[]) => {
        const categoryMap: { [key: string]: number } = {};
        products.forEach((product) => {
          if (categoryMap[product.category]) {
            categoryMap[product.category]++;
          } else {
            categoryMap[product.category] = 1;
          }
        });
        return Object.keys(categoryMap).map((category) => ({
          categoryName: category,
          quantity: categoryMap[category],
        }));
      })
    );
  }
}
