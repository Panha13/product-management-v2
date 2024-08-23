import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface QueryParam {
  pageIndex: number;
  pageSize: number;
  searchQuery: string;
}

export class BaseApiService<T> {
  constructor(protected http: HttpClient, private endpoint: string) {}

  protected apiUrl = environment.apiUrl;
  private getEndpoint(): string {
    return `${this.apiUrl}/${this.endpoint}`;
  }

  getAll(params: QueryParam): Observable<any> {
    const httpParams = new HttpParams()
      .set('page', params.pageIndex.toString())
      .set('pageSize', params.pageSize.toString())
      .set('searchQuery', params.searchQuery);

    return this.http.get<any>(this.getEndpoint(), { params: httpParams });
  }

  find(id: number): Observable<T> {
    return this.http.get<T>(`${this.getEndpoint()}/${id}`);
  }

  add(item: T): Observable<T> {
    return this.http.post<T>(this.getEndpoint(), item);
  }

  edit(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.getEndpoint()}/${id}`, item);
  }

  delete(id: number, note?: string): Observable<void> {
    return this.http.delete<void>(`${this.getEndpoint()}/${id}`, {
      body: { note },
    });
  }
}
