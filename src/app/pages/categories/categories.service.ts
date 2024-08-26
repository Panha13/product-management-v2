import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Category {
  category_id?: number;
  name?: string;
  description?: string;
}
export interface QueryParam {
  pageIndex: number;
  pageSize: number;
  searchQuery: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private _apiUrl = 'http://localhost:3000/api/categories';
  constructor(private http: HttpClient) {}

  getCategories(param: QueryParam): Observable<any> {
    const params = new HttpParams()
      .set('page', param.pageIndex.toString())
      .set('pageSize', param.pageSize.toString())
      .set('searchQuery', param.searchQuery);
    return this.http.get<any>(this._apiUrl, { params });
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this._apiUrl}/${id}`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this._apiUrl, category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this._apiUrl}/${id}`, category);
  }

  deleteCate(id: number, note?: string): Observable<void> {
    return this.http.delete<void>(`${this._apiUrl}/${id}`, {
      body: { note },
    });
  }
}
